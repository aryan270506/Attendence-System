import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import Svg, { Circle } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ref, get } from "firebase/database";
import { db } from "../firebase";
import api from "../../src/utils/axios";

/* ================= CIRCLE ================= */
const AttendanceCircle = ({ percentage, size = 120 }) => {
  const getColor = () => {
    if (percentage < 60) return "#EF4444";
    if (percentage < 80) return "#F59E0B";
    return "#10B981";
  };

  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={[styles.circleContainer, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke="#E5E7EB" strokeWidth="12" fill="none" />
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

/* ================= SUBJECT CARD ================= */
const SubjectCard = ({ subject, present, total }) => {
  const percentage = total === 0 ? 0 : Math.round((present / total) * 100);

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

/* ================= MAIN SCREEN ================= */
export default function AttendanceScreen() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
  try {
    setLoading(true);

    const studentId = await AsyncStorage.getItem("studentId");
    if (!studentId) return;

    // 🔹 1. FETCH STUDENT FROM FIREBASE
    const snap = await get(ref(db, `students/${studentId}`));
    if (!snap.exists()) return;

    const { year, division, subjects: firebaseSubjects } = snap.val();

    // 🔹 2. PREPARE DEFAULT SUBJECT STRUCTURE (0 / 0)
    const baseSubjects = firebaseSubjects.map((sub) => ({
      subject: sub,
      present: 0,
      total: 0,
    }));

    // 🔹 3. FETCH ATTENDANCE FROM MONGO
    const res = await api.post("/api/attendance/student-summary", {
      studentId,
      year,
      division,
      subjects: firebaseSubjects,
    });

    const mongoData = res.data.subjects || [];

    // 🔹 4. MERGE FIREBASE + MONGO
    const merged = baseSubjects.map((fs) => {
      const match = mongoData.find((m) => m.subject === fs.subject);
      return match ? match : fs;
    });

    setSubjects(merged);
  } catch (err) {
    console.error("Attendance error:", err);
    Alert.alert("Error", "Failed to load attendance");
  } finally {
    setLoading(false);
  }
};


  /* ================= OVERALL ================= */
  const totalPresent = subjects.reduce((s, x) => s + x.present, 0);
  const totalClasses = subjects.reduce((s, x) => s + x.total, 0);
  const overallAttendance =
    totalClasses === 0 ? 0 : Math.round((totalPresent / totalClasses) * 100);

  /* ================= UI ================= */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text>Loading attendance...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance Overview</Text>
      </View>

      {/* Overall */}
      <View style={styles.overallSection}>
        <Text style={styles.overallLabel}>Overall Attendance</Text>
        <AttendanceCircle percentage={overallAttendance} size={160} />
        <Text style={styles.overallSubtext}>
          {totalPresent} / {totalClasses} classes attended
        </Text>
      </View>

      {/* Subject-wise */}
      <View style={styles.subjectsSection}>
        <Text style={styles.sectionTitle}>Subject-wise Attendance</Text>
        {subjects.map((sub) => (
          <SubjectCard
            key={sub.subject}
            subject={sub.subject}
            present={sub.present}
            total={sub.total}
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