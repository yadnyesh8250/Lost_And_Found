import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const isAllowedOrigin = (origin, callback) => {
  if (!origin) return callback(null, true);
  const cleanOrigin = origin.replace(/\/$/, "");
  if (cleanOrigin.includes("localhost") || cleanOrigin.includes("127.0.0.1")) return callback(null, true);
  if (cleanOrigin.endsWith(".vercel.app")) return callback(null, true);
  if (process.env.CLIENT_URL && cleanOrigin === process.env.CLIENT_URL.replace(/\/$/, "")) return callback(null, true);
  return callback(null, false);
};

const io = new Server(server, {
  cors: {
    origin: isAllowedOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
 const userSocketMap = {};
export const getReciverSocketId = (receiverId)=>{
  return userSocketMap[String(receiverId)];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
