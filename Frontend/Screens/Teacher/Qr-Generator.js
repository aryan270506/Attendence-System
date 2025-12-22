import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function AttendanceQRScreen({ navigation, route }) {
    const { className, sectionName } = route.params;
  const [qrValue, setQrValue] = useState(generateQR());

  function generateQR() {
    return "CLASS_10A-" + Math.random().toString(36).substring(2, 12);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setQrValue(generateQR());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Live Attendance QR</Text>
      <Text style={{ fontSize: 20 }}>Year: {className}</Text>
    <Text style={{ fontSize: 20 }}>Division: {sectionName}</Text>


      <View style={styles.qrBox}>
        <QRCode value={qrValue} size={250} />
      </View>

      <Text style={styles.codeText}>Token: {qrValue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 60,
  },
  backBtn: {
    position: "absolute",
    top: 20,
    left: 15,
    padding: 10,
  },
  backText: {
    fontSize: 20,
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 4,
    color: "#666",
  },
  qrBox: {
    marginTop: 40,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  codeText: {
    marginTop: 20,
    color: "#333",
    fontSize: 16,
  },
});
