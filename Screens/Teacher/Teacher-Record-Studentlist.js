import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

const StudentListScreen = ({ navigation }) => {
  const students = [
    { id: '1', name: 'Emma Johnson' },
    { id: '2', name: 'Liam Smith' },
    { id: '3', name: 'Olivia Brown' },
    { id: '4', name: 'Noah Davis' },
    { id: '5', name: 'Ava Wilson' },
    { id: '6', name: 'Ethan Martinez' },
    { id: '7', name: 'Sophia Garcia' },
    { id: '8', name: 'Mason Rodriguez' },
    { id: '9', name: 'Isabella Lee' },
    { id: '10', name: 'James Anderson' },
  ];

  const renderStudent = ({ item }) => (
    <TouchableOpacity
      style={styles.studentCard}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('StudentRecordTeacher', {
          studentId: item.id,
          studentName: item.name,
        })
      }
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.split(' ').map(n => n[0]).join('')}
        </Text>
      </View>

      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Students</Text>
      </View>

      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default StudentListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4f46e5',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  listContainer: {
    padding: 16,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  studentGrade: {
    fontSize: 14,
    color: '#6b7280',
  },
});

