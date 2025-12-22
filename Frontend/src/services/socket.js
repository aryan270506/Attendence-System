// socket.js (frontend)
import { io } from "socket.io-client";

let socket;

export const connectSocket = (userId, role) => {
  socket = io("http://localhost:5000");

  socket.on("connect", () => {
    console.log("Connected socket:", socket.id);

    socket.emit("register", {
      userId,   // 🔑 Firebase user ID
      role
    });
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
