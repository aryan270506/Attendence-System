import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TeacherRecord({ navigation }) {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [recentClasses, setRecentClasses] = useState([]);

  const classes = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const sections = ['Div A', 'Div B', 'Div C'];

  // Load recent classes when component mounts
  useEffect(() => {
    loadRecentClasses();
  }, []);

  // Load recent classes from AsyncStorage
  const loadRecentClasses = async () => {
    try {
      const stored = await AsyncStorage.getItem('recentClasses');
      if (stored) {
        setRecentClasses(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading recent classes:', error);
    }
  };

  // Save a class-section combination to recents
  const saveToRecents = async (className, sectionName) => {
    try {
      const newEntry = {
        className,
        sectionName,
        timestamp: new Date().toISOString(),
      };

      // Remove duplicate if exists
      const filtered = recentClasses.filter(
        item => !(item.className === className && item.sectionName === sectionName)
      );

      // Add to beginning and keep only last 6
      const updated = [newEntry, ...filtered].slice(0, 6);
      
      setRecentClasses(updated);
      await AsyncStorage.setItem('recentClasses', JSON.stringify(updated));
    } catch (error) {
      console.log('Error saving to recents:', error);
    }
  };

  const handleSubmit = () => {
    if (selectedClass && selectedSection) {
      // Save to recents
      saveToRecents(selectedClass, selectedSection);
      
      // Navigate to the QR screen with params
      navigation.navigate("AttendanceQRScreen", {
        className: selectedClass,
        sectionName: selectedSection,
      });
    } else {
      Alert.alert(
        "Incomplete Selection",
        "Please select both class and section",
        [{ text: "OK" }]
      );
    }
  };

  const handleEditAttendance = (className, sectionName) => {
    navigation.navigate("EditAttendanceScreen", {
      className: className,
      sectionName: sectionName,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Select Year & Division</Text>
        <Text style={styles.subtitle}>Choose your class and section</Text>

        {/* Class Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Year</Text>
          <View style={styles.classGrid}>
            {classes.map((cls) => (
              <TouchableOpacity
                key={cls}
                style={[
                  styles.classButton,
                  selectedClass === cls && styles.selectedButton,
                ]}
                onPress={() => setSelectedClass(cls)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    selectedClass === cls && styles.selectedButtonText,
                  ]}
                >
                  {cls}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Division</Text>
          <View style={styles.sectionGrid}>
            {sections.map((section) => (
              <TouchableOpacity
                key={section}
                style={[
                  styles.sectionButton,
                  selectedSection === section && styles.selectedButton,
                ]}
                onPress={() => setSelectedSection(section)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    selectedSection === section && styles.selectedButtonText,
                  ]}
                >
                  {section.split(" ")[1]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selected Info */}
        {(selectedClass || selectedSection) && (
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionLabel}>Your Selection:</Text>
            <Text style={styles.selectionText}>
              {selectedClass || 'No class selected'} - {selectedSection || 'No section selected'}
            </Text>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Confirm Selection</Text>
        </TouchableOpacity>

        {/* Recent Classes Section */}
        {recentClasses.length > 0 && (
          <>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>RECENT CLASSES</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.recentsSection}>
              <Text style={styles.recentsSectionTitle}>Recently Accessed</Text>
              <Text style={styles.recentsSectionSubtitle}>
                Tap to edit attendance
              </Text>
              <View style={styles.recentsGrid}>
                {recentClasses.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.recentCard}
                    onPress={() => handleEditAttendance(item.className, item.sectionName)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.recentCardContent}>
                      <Text style={styles.recentClassName}>{item.className}</Text>
                      <Text style={styles.recentSectionName}>
                        {item.sectionName.split(" ")[1]}
                      </Text>
                    </View>
                    <Text style={styles.editLabel}>Edit</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Extra bottom space */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 15,
  },
  classGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sectionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  classButton: {
    width: '48%',
    backgroundColor: '#e2e8f0',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  sectionButton: {
    width: '30%',
    backgroundColor: '#e2e8f0',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#4f46e5',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  selectedButtonText: {
    color: '#ffffff',
  },
  selectionInfo: {
    backgroundColor: '#eef2ff',
    padding: 16,
    borderRadius: 12,
  },
  selectionLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  selectionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4f46e5',
  },
  submitButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
  },
  recentsSection: {
    marginBottom: 20,
  },
  recentsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  recentsSectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 15,
  },
  recentsGrid: {
    gap: 12,
  },
  recentCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  recentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recentClassName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  recentSectionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4f46e5',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f46e5',
  },
});