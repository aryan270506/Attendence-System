// socket.js
const { Server } = require("socket.io");

// Map userId → socketId
const userSockets = {};
// { "T123": "socketId123" }

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    // Register user AFTER login
    socket.on("register", ({ userId, role }) => {
      userSockets[userId] = socket.id;

      socket.userId = userId;
      socket.role = role;

      console.log(`✅ Registered user ${userId} (${role})`);
    });

    // Example: teacher starts attendance
    socket.on("start-attendance", () => {
      if (!socket.userId || socket.role !== "teacher") {
        console.log("❌ Unauthorized");
        return;
      }

      console.log("📸 Attendance started by:", socket.userId);
    });

    // Cleanup on disconnect
    socket.on("disconnect", () => {
      if (socket.userId) {
        delete userSockets[socket.userId];
        console.log("🔴 User disconnected:", socket.userId);
      }
    });
  });

  return io;
}

module.exports = initSocket;
