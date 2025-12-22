const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const initSocket = require("./Socket");

const app = express();

// Middleware
app.use(express.json());

// MongoDB connection
const MONGO_URI = "mongodb://localhost:27017/Attendence-System";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Basic route
app.get("/", (req, res) => {
  res.send("Attendance Backend Running");
});

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.IO
initSocket(server);

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
