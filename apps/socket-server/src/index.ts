import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import Redis from "ioredis";
import { Server as SocketServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import jwt from "jsonwebtoken";
import { connectDB, Message } from "@repo/database";
import * as cookie from "cookie";

connectDB();

const app = express();
app.use(cors());

const redis = new Redis(process.env.REDIS_URL as string);

redis.on("connect", () => console.log("Redis Connected"));
redis.on("error", (err) => console.log("Redis Error", err));

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.use((socket, next) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie || "");
  const token = cookies.token;

  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    (socket as any).userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", async (socket) => {
  const userId = (socket as any).userId;
  redis.sadd("online_users", userId);
  const onlineUsersList = await redis.smembers("online_users");
  socket.emit("online_users:list", onlineUsersList);
  io.emit("user:online", { userId });
  console.log("New client connected:", socket.id);

  socket.on("message:send", async (data) => {
    try {
      const message = await Message.create({
        chatId: data.chatId,
        sender: (socket as any).userId,
        content: data.content,
        type: data.type || "text",
      });

      io.to(data.chatId).emit("message:receive", message);
    } catch (error) {
      console.error("Message send error:", error);
    }
  });

  socket.on("message:delivered", async (messageId: string) => {
    try {
      const updated = await Message.findByIdAndUpdate(
        messageId,
        { status: "delivered" },
        { new: true },
      );
      if (updated) {
        io.to(updated.chatId.toString()).emit("message:status_update", updated);
      }
    } catch (error) {
      console.error("Delivery update error:", error);
    }
  });

  socket.on("chat:read", async (chatId: string) => {
    try {
      await Message.updateMany(
        {
          chatId,
          status: { $ne: "read" },
          sender: { $ne: (socket as any).userId },
        },
        { status: "read" },
      );
      io.to(chatId).emit("chat:read_update", {
        chatId,
        readBy: (socket as any).userId,
      });
    } catch (error) {
      console.error("Read update error:", error);
    }
  });

  socket.on("chat:join", (chatId: string) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined chat ${chatId}`);
  });

  socket.on("typing:start", (chatId: string) => {
    socket
      .to(chatId)
      .emit("typing:start", { chatId, userId: (socket as any).userId });
  });

  socket.on("typing:stop", (chatId: string) => {
    socket
      .to(chatId)
      .emit("typing:stop", { chatId, userId: (socket as any).userId });
  });

  socket.on("disconnect", async () => {
    console.log("Client disconnected:", socket.id);

    const sockets = await io.fetchSockets();
    const stillOnline = sockets.some((s: any) => s.userId === userId);

    if (!stillOnline) {
      await redis.srem("online_users", userId);
      io.emit("user:offline", { userId });
    }
  });
});

const pubClient = redis;
const subClient = redis.duplicate();

io.adapter(createAdapter(pubClient, subClient));

server.listen(PORT, () => {
  console.log(`Socket Server is running on ${PORT}`);
});
