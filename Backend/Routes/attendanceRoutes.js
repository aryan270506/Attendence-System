const express = require("express");
const AttendanceSession = require("../Modals/AttendanceSession");
const AttendanceRecord = require("../Modals/AttendanceRecord");

const router = express.Router();

/**
 * 🧑‍🏫 CREATE SESSION
 * Triggered when teacher presses "Confirm Selection"
 */
router.post("/session/create", async (req, res) => {
  try {
    const { teacherId, year, division, subject } = req.body;

    if (!teacherId || !year || !division || !subject) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const sessionId = `SES_${Date.now()}_${year}${division}_${subject}`;

    await AttendanceSession.create({
      sessionId,
      teacherId,
      year,
      division,
      subject,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    console.log(`📘 Session created: ${sessionId}`);

    res.json({ sessionId });
  } catch (err) {
    console.error("❌ Session creation failed:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 📲 MARK ATTENDANCE
 * Triggered when student scans QR
 */
router.post("/mark", async (req, res) => {
  try {
    const { sessionId, studentId } = req.body;

    const session = await AttendanceSession.findOne({ sessionId });
    if (!session) {
      return res.status(400).json({ msg: "Invalid or deleted session" });
    }

    if (Date.now() > session.expiresAt) {
      return res.status(400).json({ msg: "Session expired" });
    }

    // 🔥 ADD STUDENT TO SESSION RECORD
    await AttendanceRecord.updateOne(
      { sessionId },
      {
        $addToSet: {
          presentStudents: {
            studentId,
            scannedAt: new Date(),
          },
        },
      },
      { upsert: true }
    );

    console.log(`🧑‍🎓 Present marked → ${studentId}`);

    res.json({ msg: "Attendance marked" });
  } catch (err) {
    console.error("❌ Attendance mark failed:", err);
    res.status(500).json({ error: err.message });
  }
});


/**
 * ❌ DELETE SESSION
 * Triggered when teacher presses "Delete Class Attendance"
 */
router.delete("/session/delete", async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ msg: "sessionId required" });
    }

    await AttendanceRecord.deleteMany({ sessionId });
    await AttendanceSession.deleteOne({ sessionId });

    console.log(`❌ Session deleted completely: ${sessionId}`);

    res.json({ msg: "Attendance session deleted successfully" });
  } catch (err) {
    console.error("❌ Session delete failed:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
