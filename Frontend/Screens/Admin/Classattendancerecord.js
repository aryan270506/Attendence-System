import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../firebase';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const ClassAttendanceRecord = ({ route, navigation }) => {
  const { year, division, className, sectionName } = route.params;
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchAttendanceData();
  }, [year, division]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    
    try {
      const studentsRef = ref(db, 'students');
      const yearQuery = query(studentsRef, orderByChild('year'), equalTo(parseInt(year)));

      // Get students data once
      const snapshot = await get(yearQuery);
      const data = snapshot.val();
      
      if (!data) {
        setStudents([]);
        setSubjects([]);
        setLoading(false);
        return;
      }

      const allSubjects = new Set();
      const studentsList = [];

      // Filter students by division
      const studentsInDivision = Object.entries(data).filter(([key, student]) => 
        student.division && student.division.toUpperCase() === division.toUpperCase()
      );

      if (studentsInDivision.length === 0) {
        setStudents([]);
        setSubjects([]);
        setLoading(false);
        return;
      }

      // Process each student's attendance
      const studentPromises = studentsInDivision.map(async ([key, student]) => {
        // Collect subjects
        if (student.subjects) {
          Object.values(student.subjects).forEach((subject) => {
            allSubjects.add(subject);
          });
        }

        // Fetch attendance data for this student
        const attendanceRef = ref(db, `attendance/${key}`);
        const attendanceSnapshot = await get(attendanceRef);
        const attendanceData = attendanceSnapshot.val();
        
        const subjectAttendance = {};
        let totalPresent = 0;
        let totalClasses = 0;

        // Initialize all subjects from student record with 0 attendance
        if (student.subjects) {
          Object.values(student.subjects).forEach((subject) => {
            subjectAttendance[subject] = {
              present: 0,
              total: 0,
              percentage: 0,
            };
          });
        }

        // Update with actual attendance data if available
        if (attendanceData) {
          Object.keys(attendanceData).forEach((subject) => {
            const subjectData = attendanceData[subject];
            let present = 0;
            let total = 0;

            Object.values(subjectData).forEach((record) => {
              total++;
              if (record.status === 'present') {
                present++;
              }
            });

            subjectAttendance[subject] = {
              present,
              total,
              percentage: total > 0 ? ((present / total) * 100).toFixed(2) : 0,
            };

            totalPresent += present;
            totalClasses += total;
          });
        }

        return {
          id: key,
          name: student.name,
          studentId: student.id,
          prn: student.prn,
          subjectAttendance,
          totalPresent,
          totalClasses,
          overallPercentage: totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(2) : 0,
        };
      });

      // Wait for all students' data to be fetched
      const studentsData = await Promise.all(studentPromises);
      
      // Sort by name and update state
      setStudents(studentsData.sort((a, b) => a.name.localeCompare(b.name)));
      setSubjects(Array.from(allSubjects).sort());
      setLoading(false);

    } catch (error) {
      console.error('Error fetching attendance data:', error);
      Alert.alert('Error', 'Failed to load attendance data. Please try again.');
      setStudents([]);
      setSubjects([]);
      setLoading(false);
    }
  };

  const generateHTMLTable = () => {
    const subjectColumns = subjects.map(subject => `
      <th colspan="3" class="subject-header">${subject}</th>
    `).join('');

    const subjectSubheaders = subjects.map(() => `
      <th class="sub-header">Att.</th>
      <th class="sub-header">Tot.</th>
      <th class="sub-header">%</th>
    `).join('');

    const studentRows = students.map((student, index) => {
      const subjectCells = subjects.map(subject => {
        const attendance = student.subjectAttendance[subject] || { present: 0, total: 0, percentage: 0 };
        const percentageClass = attendance.percentage >= 75 ? 'percentage-good' : 
                                attendance.percentage >= 50 ? 'percentage-average' : 'percentage-poor';
        
        return `
          <td>${attendance.present}</td>
          <td>${attendance.total}</td>
          <td class="${percentageClass}">${attendance.percentage}%</td>
        `;
      }).join('');

      const overallClass = student.overallPercentage >= 75 ? 'percentage-good' : 
                          student.overallPercentage >= 50 ? 'percentage-average' : 'percentage-poor';

      return `
        <tr class="data-row">
          <td class="row-number">${index + 1}</td>
          <td class="student-name">${student.name}</td>
          <td class="student-id">${student.studentId}</td>
          <td class="student-prn">${student.prn || 'N/A'}</td>
          ${subjectCells}
          <td class="overall-data">${student.totalPresent}</td>
          <td class="overall-data">${student.totalClasses}</td>
          <td class="${overallClass} overall-percentage">${student.overallPercentage}%</td>
        </tr>
      `;
    }).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Class Attendance Record</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 8px;
              background-color: #ffffff;
              margin: 0;
            }
            @page {
              size: landscape;
              margin: 8mm;
            }
            .header {
              text-align: center;
              margin-bottom: 10px;
              border-bottom: 3px solid #4f46e5;
              padding-bottom: 8px;
            }
            .header h1 {
              color: #111827;
              margin: 5px 0;
              font-size: 18px;
            }
            .header p {
              color: #6b7280;
              margin: 3px 0;
              font-size: 11px;
            }
            .info-section {
              margin-bottom: 10px;
              display: flex;
              justify-content: space-around;
              padding: 6px 10px;
              background-color: #f3f4f6;
              border-radius: 4px;
            }
            .info-item {
              font-size: 9px;
              color: #374151;
            }
            .info-item strong {
              color: #111827;
            }
            .table-container {
              width: 100%;
              overflow-x: auto;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              font-size: 8px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 5px 3px;
              text-align: center;
            }
            th {
              background-color: #111827;
              color: white;
              font-weight: 600;
              font-size: 8px;
            }
            .subject-header {
              background-color: #4f46e5;
              color: white;
              padding: 6px 3px;
              font-size: 8px;
              white-space: nowrap;
            }
            .sub-header {
              background-color: #6366f1;
              color: white;
              font-size: 7px;
              padding: 4px 2px;
              white-space: nowrap;
            }
            .row-number {
              background-color: #f9fafb;
              font-weight: bold;
              width: 25px;
              min-width: 25px;
            }
            .student-name {
              text-align: left;
              font-weight: 500;
              background-color: #f9fafb;
              min-width: 80px;
              max-width: 120px;
              padding-left: 5px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .student-id {
              background-color: #f9fafb;
              min-width: 50px;
              font-size: 7px;
            }
            .student-prn {
              background-color: #f9fafb;
              min-width: 70px;
              font-size: 7px;
            }
            .data-row:nth-child(even) {
              background-color: #f9fafb;
            }
            .data-row:nth-child(odd) {
              background-color: #ffffff;
            }
            .data-row td {
              font-size: 8px;
            }
            .overall-data {
              font-weight: bold;
              background-color: #d1fae5;
              border-left: 2px solid #059669;
            }
            .overall-percentage {
              font-weight: bold;
              font-size: 9px;
              background-color: #d1fae5;
            }
            .percentage-good {
              color: #10b981;
              font-weight: bold;
            }
            .percentage-average {
              color: #f59e0b;
              font-weight: bold;
            }
            .percentage-poor {
              color: #ef4444;
              font-weight: bold;
            }
            thead tr:first-child th {
              background-color: #111827;
            }
            .overall-header {
              background-color: #059669;
              color: white;
              font-size: 8px;
            }
            .footer {
              margin-top: 10px;
              padding-top: 8px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 7px;
            }
            @media print {
              @page {
                size: landscape;
                margin: 6mm;
              }
              body {
                padding: 5px;
              }
              .header h1 {
                font-size: 16px;
              }
              .header p {
                font-size: 9px;
              }
              .info-section {
                padding: 4px 8px;
              }
              .info-item {
                font-size: 8px;
              }
              table {
                font-size: 7px;
              }
              th, td {
                padding: 3px 2px;
              }
              .subject-header {
                font-size: 7px;
                padding: 4px 2px;
              }
              .sub-header {
                font-size: 6px;
                padding: 3px 1px;
              }
              .student-name {
                min-width: 70px;
                font-size: 7px;
              }
              .student-id, .student-prn {
                font-size: 6px;
                min-width: 45px;
              }
              .data-row td {
                font-size: 7px;
              }
              .overall-percentage {
                font-size: 8px;
              }
              .footer {
                font-size: 6px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 Class Attendance Record</h1>
            <p><strong>${className} - ${sectionName}</strong></p>
            <p>Year ${year} | Division ${division}</p>
          </div>

          <div class="info-section">
            <div class="info-item">
              <strong>Total Students:</strong> ${students.length}
            </div>
            <div class="info-item">
              <strong>Date Generated:</strong> ${new Date().toLocaleDateString('en-IN', { 
                day: 'numeric',
                month: 'long', 
                year: 'numeric'
              })}
            </div>
            <div class="info-item">
              <strong>Subjects:</strong> ${subjects.length}
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th rowspan="2">No.</th>
                  <th rowspan="2">Student Name</th>
                  <th rowspan="2">Student ID</th>
                  <th rowspan="2">PRN</th>
                  ${subjectColumns}
                  <th colspan="3" class="overall-header">Overall Attendance</th>
                </tr>
                <tr>
                  ${subjectSubheaders}
                  <th class="sub-header">Tot. Att.</th>
                  <th class="sub-header">Tot. Lec.</th>
                  <th class="sub-header">%</th>
                </tr>
              </thead>
              <tbody>
                ${studentRows}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <p>Generated on ${new Date().toLocaleString('en-IN')}</p>
            <p>This is a computer-generated document. Legend: 🟢 ≥75% | 🟡 50-74% | 🔴 <50%</p>
          </div>
        </body>
      </html>
    `;
  };

  const handlePrint = async () => {
    // Ensure data is loaded
    if (loading) {
      Alert.alert('Please Wait', 'Attendance data is still loading...');
      return;
    }

    if (students.length === 0) {
      Alert.alert('No Data', 'There is no attendance data to print.');
      return;
    }

    try {
      const html = generateHTMLTable();
      
      if (Platform.OS === 'web') {
        // For web, open print dialog
        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
      } else {
        // For mobile, use expo-print
        const { uri } = await Print.printToFileAsync({ html });
        
        Alert.alert(
          'Success',
          'Attendance record generated!',
          [
            {
              text: 'Share',
              onPress: async () => {
                if (await Sharing.isAvailableAsync()) {
                  await Sharing.shareAsync(uri);
                }
              },
            },
            {
              text: 'Print',
              onPress: async () => {
                await Print.printAsync({ uri });
              },
            },
            { text: 'OK', style: 'cancel' },
          ]
        );
      }
    } catch (error) {
      console.error('Error generating print:', error);
      Alert.alert('Error', 'Failed to generate attendance record');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text style={styles.loadingText}>Loading attendance data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Class Attendance Record</Text>
          <Text style={styles.headerSubtitle}>
            {className} - {sectionName} | {students.length} students
          </Text>
        </View>
        <TouchableOpacity style={styles.printButton} onPress={handlePrint}>
          <Text style={styles.printButtonText}>🖨️ Print</Text>
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Legend:</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
            <Text style={styles.legendText}>≥75% (Good)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.legendText}>50-74% (Average)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.legendText}>&lt;50% (Poor)</Text>
          </View>
        </View>
      </View>

      {students.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No attendance data available</Text>
        </View>
      ) : (
        /* Table */
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          style={styles.horizontalScroll}
        >
          <ScrollView 
            showsVerticalScrollIndicator={true}
            style={styles.verticalScroll}
          >
            <View style={styles.tableContainer}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.noCell]}>No.</Text>
                <Text style={[styles.headerCell, styles.nameCell]}>Student Name</Text>
                <Text style={[styles.headerCell, styles.idCell]}>ID</Text>
                <Text style={[styles.headerCell, styles.prnCell]}>PRN</Text>
                
                {subjects.map((subject) => (
                  <View key={subject} style={styles.subjectHeaderGroup}>
                    <Text style={[styles.headerCell, styles.subjectMainHeader]}>{subject}</Text>
                    <View style={styles.subjectSubHeaders}>
                      <Text style={[styles.subHeaderCell, styles.attendanceSubCell]}>Attended</Text>
                      <Text style={[styles.subHeaderCell, styles.attendanceSubCell]}>Total</Text>
                      <Text style={[styles.subHeaderCell, styles.attendanceSubCell]}>%</Text>
                    </View>
                  </View>
                ))}
                
                <View style={styles.overallHeaderGroup}>
                  <Text style={[styles.headerCell, styles.overallMainHeader]}>Overall</Text>
                  <View style={styles.subjectSubHeaders}>
                    <Text style={[styles.subHeaderCell, styles.overallSubCell]}>Attended</Text>
                    <Text style={[styles.subHeaderCell, styles.overallSubCell]}>Total Lectures</Text>
                    <Text style={[styles.subHeaderCell, styles.overallSubCell]}>%</Text>
                  </View>
                </View>
              </View>

              {/* Table Rows */}
              {students.map((student, index) => (
                <View 
                  key={student.id} 
                  style={[
                    styles.tableRow, 
                    index % 2 === 0 ? styles.evenRow : styles.oddRow
                  ]}
                >
                  <Text style={[styles.cell, styles.noCell]}>{index + 1}</Text>
                  <Text style={[styles.cell, styles.nameCell, styles.nameText]}>{student.name}</Text>
                  <Text style={[styles.cell, styles.idCell]}>{student.studentId}</Text>
                  <Text style={[styles.cell, styles.prnCell]}>{student.prn || 'N/A'}</Text>
                  
                  {subjects.map((subject) => {
                    const attendance = student.subjectAttendance[subject] || { 
                      present: 0, 
                      total: 0, 
                      percentage: 0 
                    };
                    const percentageColor = 
                      attendance.percentage >= 75 ? '#10b981' : 
                      attendance.percentage >= 50 ? '#f59e0b' : '#ef4444';
                    
                    return (
                      <React.Fragment key={subject}>
                        <Text style={[styles.cell, styles.attendanceSubCell]}>{attendance.present}</Text>
                        <Text style={[styles.cell, styles.attendanceSubCell]}>{attendance.total}</Text>
                        <Text style={[styles.cell, styles.attendanceSubCell, { color: percentageColor, fontWeight: 'bold' }]}>
                          {attendance.percentage}%
                        </Text>
                      </React.Fragment>
                    );
                  })}
                  
                  <Text style={[styles.cell, styles.overallSubCell, styles.boldText]}>{student.totalPresent}</Text>
                  <Text style={[styles.cell, styles.overallSubCell, styles.boldText]}>{student.totalClasses}</Text>
                  <Text style={[
                    styles.cell, 
                    styles.overallSubCell, 
                    styles.boldText,
                    { 
                      color: student.overallPercentage >= 75 ? '#10b981' : 
                             student.overallPercentage >= 50 ? '#f59e0b' : '#ef4444' 
                    }
                  ]}>
                    {student.overallPercentage}%
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  printButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  printButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  legendContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
  },
  horizontalScroll: {
    flex: 1,
  },
  verticalScroll: {
    flex: 1,
  },
  tableContainer: {
    padding: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#111827',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  evenRow: {
    backgroundColor: '#f9fafb',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  headerCell: {
    padding: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
  },
  subHeaderCell: {
    padding: 8,
    fontWeight: '600',
    color: '#ffffff',
    fontSize: 10,
    textAlign: 'center',
    backgroundColor: '#374151',
  },
  cell: {
    padding: 12,
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
  },
  noCell: {
    width: 50,
  },
  nameCell: {
    width: 180,
  },
  nameText: {
    textAlign: 'left',
    fontWeight: '500',
  },
  idCell: {
    width: 100,
  },
  prnCell: {
    width: 120,
  },
  subjectHeaderGroup: {
    borderLeftWidth: 1,
    borderLeftColor: '#4b5563',
  },
  subjectMainHeader: {
    backgroundColor: '#4f46e5',
    paddingVertical: 8,
    fontSize: 13,
  },
  subjectSubHeaders: {
    flexDirection: 'row',
  },
  attendanceSubCell: {
    width: 70,
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
  },
  overallHeaderGroup: {
    borderLeftWidth: 2,
    borderLeftColor: '#059669',
  },
  overallMainHeader: {
    backgroundColor: '#059669',
    paddingVertical: 8,
    fontSize: 13,
  },
  overallSubCell: {
    width: 90,
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
  },
  boldText: {
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default ClassAttendanceRecord;