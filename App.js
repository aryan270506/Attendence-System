import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './Screens/Login/login.js';

// Admin Screens
import AdminDashboard from './Screens/Admin/Admin-Dashboard.js';
import AdminClassSectionSelector from './Screens/Admin/Admin-YearSelection.js';
import StudentList from './Screens/Admin/Student-List.js';
import StudentAttendanceProfile from './Screens/Admin/Student-Attendance-Profile.js';
import AdminProfile from './Screens/Admin/Admin-Profile.js';


// Teacher Screens
import TeacherDashboard from './Screens/Teacher/Teacher-Dashboard.js';
import ClassSectionSelector from './Screens/Teacher/Teacher-Classselection.js';
import AttendanceQRScreen from './Screens/Teacher/Qr-Generator.js';
import StudentListScreen from './Screens/Teacher/Teacher-Record-Studentlist.js';
import StudentRecordTeacher from './Screens/Teacher/Student-Record.js';
import EditAttendanceScreen from './Screens/Teacher/Editattendancescreen.js'; 


// Student Screens
import Studentdashboard from './Screens/Student/Student-Dashboard.js';
import AttendanceCircle from './Screens/Student/Student-Record.js';
import StudentQRScannerScreen from './Screens/Student/Qr-Scanner.js';
import StudentProfile from './Screens/Student/Student-Profile.js';





const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>

      <Stack.Navigator initialRouteName="Login">

        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="StudentDashboard" 
          component={Studentdashboard} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="TeacherDashboard" 
          component={TeacherDashboard} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboard} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="ClassSectionSelector" 
          component={ClassSectionSelector} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="AttendanceQRScreen" 
          component={AttendanceQRScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="StudentListScreen" 
          component={StudentListScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="AttendanceCircle" 
          component={AttendanceCircle} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="StudentQRScannerScreen" 
          component={StudentQRScannerScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="StudentProfile" 
          component={StudentProfile} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="AdminClassSectionSelector" 
          component={AdminClassSectionSelector} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="StudentList" 
          component={StudentList} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="StudentAttendanceProfile" 
          component={StudentAttendanceProfile} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="AdminProfile" 
          component={AdminProfile} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="StudentRecordTeacher" 
          component={StudentRecordTeacher} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="EditAttendanceScreen" 
          component={EditAttendanceScreen} 
          options={{ headerShown: false }} 
        />

        

      </Stack.Navigator>

      

      <StatusBar style="auto" />

    </NavigationContainer>
  );
}