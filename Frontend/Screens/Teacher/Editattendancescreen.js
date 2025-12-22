import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';

export default function EditAttendanceScreen({ route, navigation }) {
  const { className, sectionName, date } = route.params;
  
  // Mock student data - Replace this with your actual data source
  const [students, setStudents] = useState([
    { id: 1, rollNo: '01', name: 'Aarav Sharma', status: 'present' },
    { id: 2, rollNo: '02', name: 'Diya Patel', status: 'present' },
    { id: 3, rollNo: '03', name: 'Arjun Verma', status: 'absent' },
    { id: 4, rollNo: '04', name: 'Ananya Singh', status: 'present' },
    { id: 5, rollNo: '05', name: 'Vihaan Kumar', status: 'present' },
    { id: 6, rollNo: '06', name: 'Saanvi Gupta', status: 'absent' },
    { id: 7, rollNo: '07', name: 'Reyansh Reddy', status: 'present' },
    { id: 8, rollNo: '08', name: 'Aadhya Joshi', status: 'present' },
    { id: 9, rollNo: '09', name: 'Ishaan Mehta', status: 'present' },
    { id: 10, rollNo: '10', name: 'Myra Desai', status: 'absent' },
  ]);

  const toggleAttendance = (studentId) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? { ...student, status: student.status === 'present' ? 'absent' : 'present' }
          : student
      )
    );
  };

  const getPresentCount = () => {
    return students.filter(s => s.status === 'present').length;
  };

  const getAbsentCount = () => {
    return students.filter(s => s.status === 'absent').length;
  };

  const handleSave = () => {
    Alert.alert(
      'Save Changes',
      'Are you sure you want to save the attendance changes?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: () => {
            // TODO: Save attendance to your database/backend
            Alert.alert('Success', 'Attendance updated successfully!', [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ]);
          },
        },
      ]
    );
  };

  const handleMarkAllPresent = () => {
    setStudents(prevStudents =>
      prevStudents.map(student => ({ ...student, status: 'present' }))
    );
  };

  const handleMarkAllAbsent = () => {
    setStudents(prevStudents =>
      prevStudents.map(student => ({ ...student, status: 'absent' }))
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Edit Attendance</Text>
          <Text style={styles.headerSubtitle}>
            {className} - {sectionName}
          </Text>
          {date && <Text style={styles.dateText}>{date}</Text>}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{students.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statBox, styles.presentBox]}>
          <Text style={[styles.statNumber, styles.presentText]}>{getPresentCount()}</Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>
        <View style={[styles.statBox, styles.absentBox]}>
          <Text style={[styles.statNumber, styles.absentText]}>{getAbsentCount()}</Text>
          <Text style={styles.statLabel}>Absent</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleMarkAllPresent}
        >
          <Text style={styles.quickActionText}>Mark All Present</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickActionButton, styles.quickActionButtonSecondary]}
          onPress={handleMarkAllAbsent}
        >
          <Text style={styles.quickActionTextSecondary}>Mark All Absent</Text>
        </TouchableOpacity>
      </View>

      {/* Student List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {students.map((student) => (
          <View key={student.id} style={styles.studentCard}>
            <View style={styles.studentInfo}>
              <View style={styles.rollNoContainer}>
                <Text style={styles.rollNo}>{student.rollNo}</Text>
              </View>
              <Text style={styles.studentName}>{student.name}</Text>
            </View>
            
            <TouchableOpacity
              style={[
                styles.statusButton,
                student.status === 'present' ? styles.presentButton : styles.absentButton,
              ]}
              onPress={() => toggleAttendance(student.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.statusText,
                  student.status === 'present' ? styles.presentStatusText : styles.absentStatusText,
                ]}
              >
                {student.status === 'present' ? 'Present' : 'Absent'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Extra space at bottom */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4f46e5',
    fontWeight: '600',
  },
  headerInfo: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statBox: {
    alignItems: 'center',
  },
  presentBox: {
    backgroundColor: '#f0fdf4',
    padding: 10,
    borderRadius: 8,
  },
  absentBox: {
    backgroundColor: '#fef2f2',
    padding: 10,
    borderRadius: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  presentText: {
    color: '#16a34a',
  },
  absentText: {
    color: '#dc2626',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickActionButtonSecondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionTextSecondary: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    marginTop: 15,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  studentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rollNoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rollNo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4f46e5',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  statusButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 90,
    alignItems: 'center',
  },
  presentButton: {
    backgroundColor: '#dcfce7',
  },
  absentButton: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  presentStatusText: {
    color: '#16a34a',
  },
  absentStatusText: {
    color: '#dc2626',
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  saveButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});