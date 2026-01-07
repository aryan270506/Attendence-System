import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';



const subjectAttendance = [
  { id: '1', subject: 'Mathematics', attended: 18, total: 22 },
  { id: '2', subject: 'Physics', attended: 12, total: 20 },
  { id: '3', subject: 'Computer Science', attended: 20, total: 22 },
  { id: '4', subject: 'Chemistry', attended: 14, total: 20 },
];

export default function StudentRecordTeacher({ route }) {
  const { studentName } = route.params;

  // 🔢 Calculate totals
  const totalLectures = subjectAttendance.reduce(
    (sum, s) => sum + s.total,
    0
  );
  const totalAttended = subjectAttendance.reduce(
    (sum, s) => sum + s.attended,
    0
  );

  const overallPercentage = Math.round(
    (totalAttended / totalLectures) * 100
  );

  const getOverallColor = () => {
    if (overallPercentage >= 75) return '#16a34a';
    if (overallPercentage >= 60) return '#f59e0b';
    return '#dc2626';
  };

  const renderItem = ({ item }) => {
    const percentage = Math.round((item.attended / item.total) * 100);

    return (
      <View style={styles.row}>
        <Text style={[styles.cell, styles.subject]}>
          {item.subject}
        </Text>
        <Text style={styles.cell}>{item.attended}</Text>
        <Text style={styles.cell}>{item.total}</Text>
        <Text
          style={[
            styles.cell,
            { color: percentage < 75 ? '#dc2626' : '#16a34a', fontWeight: '700' },
          ]}
        >
          {percentage}%
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.studentName}>{studentName}</Text>
        <Text style={styles.subtitle}>Attendance Overview</Text>
      </View>

      {/* 🔥 OVERALL ATTENDANCE CARD */}
      <View style={styles.overallCard}>
        <Text
          style={[
            styles.overallPercentage,
            { color: getOverallColor() },
          ]}
        >
          {overallPercentage}%
        </Text>

        <Text style={styles.overallText}>
          Attended {totalAttended} out of {totalLectures} lectures
        </Text>

        
      </View>

      {/* SUBJECT TABLE HEADER */}
      <View style={[styles.row, styles.tableHeader]}>
        <Text style={[styles.cell, styles.subject, styles.headerText]}>
          Subject
        </Text>
        <Text style={[styles.cell, styles.headersText]}>
          Attended
        </Text>
        <Text style={[styles.cell, styles.headerText]}>
          Total
        </Text>
        <Text style={[styles.cell, styles.headerText]}>
          %
        </Text>
      </View>

      {/* SUBJECT TABLE */}
      <FlatList
        data={subjectAttendance}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
  },

  header: {
    marginTop: 20,
    marginBottom: 16,
  },

  studentName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e293b',
  },

  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },

  overallCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 3,
  },

  overallPercentage: {
    fontSize: 52,
    fontWeight: 'bold',
  },

  overallText: {
    fontSize: 16,
    color: '#475569',
    marginTop: 6,
  },

  statusText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '700',
  },

  tableHeader: {
    backgroundColor: '#e5e7eb',
  },

  row: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
  },

  cell: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    textAlign: 'center',
  },

  subject: {
    flex: 2,
    textAlign: 'left',
  },

  headerText: {
    fontWeight: '900',
    color: '#080808ff',
    fontSize: 13,
  },
  headersText: {
    fontWeight: '900',
    color: '#334155',
    fontSize: 13,
  }
});

