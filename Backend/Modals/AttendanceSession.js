const mongoose = require("mongoose");

const attendanceSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  teacherId: { type: String, required: true },
  year: Number,
  division: String,
  subject: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  isFinalized: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model(
  "AttendanceSession",
  attendanceSessionSchema
);
