import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";


export default function StudentQRScannerScreen({ navigation, route }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
  requestPermission();
}, []);

  


  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanned && scanning) {
      setScanned(true);
      setScanning(false);

      // Check if QR code matches expected format
      if (data.startsWith("CLASS_")) {
        // Extract the token
        const token = data;
        
        // Show success message
        Alert.alert(
          "Attendance Marked! ✓",
          `Your attendance has been recorded.\n\nToken: ${token}`,
          [
            {
              text: "OK",
              onPress: () => {
                // Here you would typically send the attendance data to your backend
                // Example: submitAttendance(token);
                navigation.goBack();
              },
            },
            {
              text: "Scan Again",
              onPress: () => {
                setScanned(false);
                setScanning(true);
              },
            },
          ]
        );
      } else {
        // Invalid QR code
        Alert.alert(
          "Invalid QR Code",
          "This is not a valid attendance QR code. Please scan the QR code displayed by your teacher.",
          [
            {
              text: "Try Again",
              onPress: () => {
                setScanned(false);
                setScanning(true);
              },
            },
          ]
        );
      }
    }
  };

if (!permission) {
  return (
    <View style={styles.container}>
      <Text>Requesting camera permission...</Text>
    </View>
  );
}

if (!permission.granted) {
  return (
    <View style={styles.container}>
      <Text>No access to camera</Text>
    </View>
  );
}


  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Scan Attendance QR</Text>
        <Text style={styles.subtitle}>
          Point your camera at the QR code displayed by your teacher
        </Text>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
  style={styles.camera}
  barcodeScannerSettings={{
    barcodeTypes: ["qr"],
  }}
  onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
/>


        {/* Scanner Frame Overlay */}
        <View style={styles.overlay}>
          <View style={styles.scannerFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        {/* Scanning Indicator */}
        {scanning && !scanned && (
          <View style={styles.scanningIndicator}>
            <View style={styles.scanLine} />
            <Text style={styles.scanningText}>Scanning...</Text>
          </View>
        )}
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          📱 Hold your device steady
        </Text>
        <Text style={styles.instructionText}>
          🎯 Center the QR code in the frame
        </Text>
        <Text style={styles.instructionText}>
          ⚡ QR code refreshes every 3 seconds
        </Text>
      </View>

      {/* Manual Reset Button (if needed) */}
      {scanned && (
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            setScanned(false);
            setScanning(true);
          }}
        >
          <Text style={styles.resetButtonText}>Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 15,
    padding: 10,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
  },
  backText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  header: {
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerFrame: {
    width: 250,
    height: 250,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#fff",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanningIndicator: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    alignItems: "center",
  },
  scanLine: {
    width: 200,
    height: 2,
    backgroundColor: "#4CAF50",
    marginBottom: 10,
  },
  scanningText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  instructions: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: "#f9f9f9",
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  messageText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginTop: 100,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 40,
  },
  backButton: {
    marginTop: 30,
    alignSelf: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resetButton: {
    alignSelf: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 30,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});