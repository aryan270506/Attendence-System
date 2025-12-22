// AttendanceScreen.js - Complete Component
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

// Circular Progress Component
const AttendanceCircle = ({ percentage, size = 120 }) => {
  const getColor = () => {
    if (percentage < 60) return '#EF4444';
    if (percentage < 80) return '#F59E0B';
    return '#10B981';
  };

  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={[styles.circleContainer, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="12"
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth="12"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.percentageContainer}>
        <Text style={[styles.percentageText, { fontSize: size / 4, color: getColor() }]}>
          {percentage}%
        </Text>
      </View>
    </View>
  );
};

// Subject Card Component
const SubjectCard = ({ subject, present, total }) => {
  const percentage = Math.round((present / total) * 100);
  
  return (
    <View style={styles.subjectCard}>
      <View style={styles.subjectInfo}>
        <Text style={styles.subjectName}>{subject}</Text>
        <Text style={styles.subjectStats}>
          {present}/{total} classes
        </Text>
      </View>
      <AttendanceCircle percentage={percentage} size={70} />
    </View>
  );
};

// Main Attendance Screen
export default function AttendanceScreen() {
  const [subjects] = useState([
    { id: 1, name: 'Mathematics', present: 42, total: 50 },
    { id: 2, name: 'Physics', present: 38, total: 45 },
    { id: 3, name: 'Chemistry', present: 35, total: 48 },
    { id: 4, name: 'English', present: 28, total: 40 },
    { id: 5, name: 'Computer Science', present: 44, total: 46 },
    { id: 6, name: 'Biology', present: 25, total: 42 }
  ]);

  const calculateOverallAttendance = () => {
    const totalPresent = subjects.reduce((sum, sub) => sum + sub.present, 0);
    const totalClasses = subjects.reduce((sum, sub) => sum + sub.total, 0);
    return Math.round((totalPresent / totalClasses) * 100);
  };

  const overallAttendance = calculateOverallAttendance();
  const totalPresent = subjects.reduce((sum, sub) => sum + sub.present, 0);
  const totalClasses = subjects.reduce((sum, sub) => sum + sub.total, 0);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance Overview</Text>
      </View>

      {/* Overall Attendance Section */}
      <View style={styles.overallSection}>
        <Text style={styles.overallLabel}>Overall Attendance</Text>
        <AttendanceCircle percentage={overallAttendance} size={160} />
        <Text style={styles.overallSubtext}>
          {totalPresent} / {totalClasses} classes attended
        </Text>
      </View>

      {/* Subject-wise Attendance */}
      <View style={styles.subjectsSection}>
        <Text style={styles.sectionTitle}>Subject-wise Attendance</Text>
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject.name}
            present={subject.present}
            total={subject.total}
          />
        ))}
      </View>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  overallSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  overallLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 20,
  },
  overallSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 15,
  },
  circleContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontWeight: 'bold',
  },
  subjectsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 15,
  },
  subjectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  subjectStats: {
    fontSize: 14,
    color: '#6B7280',
  },
});