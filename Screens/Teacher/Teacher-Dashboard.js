import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import ClassSectionSelector from './Teacher-Classselection.js';
import TeacherRecord from './Teacher-Record.js';


const Tab = createBottomTabNavigator();

const MarkAttendanceScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Mark Attendance</Text>
  </View>
);

const RecordsScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Records</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Profile</Text>
  </View>
);

const TeacherDashboard = () => {
  return (
<Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      let iconName;

      if (route.name === 'Attendance') iconName = 'how-to-reg';
      else if (route.name === 'Records') iconName = 'folder';
      else iconName = 'person';

      return <MaterialIcons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#4A90E2',
    tabBarInactiveTintColor: '#8E8E93',
    tabBarStyle: {
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#E5E5EA',
      height: 60,
      paddingBottom: 8,
      paddingTop: 8,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '600',
    },
    headerStyle: {
      backgroundColor: '#4A90E2',
    },
    headerTintColor: '#FFFFFF',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 18,
    },
  })}
>
  <Tab.Screen 
    name="Attendance" 
    component={ClassSectionSelector}   // ✅ OPEN THIS SCREEN
    options={{ title: 'Mark Attendance' }}
  />

  <Tab.Screen 
    name="Records" 
    component={TeacherRecord}
    options={{ title: 'Student Records' }}
  />

  <Tab.Screen 
    name="Profile" 
    component={ProfileScreen}
    options={{ title: 'My Profile' }}
  />
</Tab.Navigator>

  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default TeacherDashboard;
