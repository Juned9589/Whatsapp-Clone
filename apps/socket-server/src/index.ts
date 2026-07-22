import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import Redis from "ioredis";
import { Server as SocketServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import jwt from "jsonwebtoken";

dotenv.config();

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
  const token = socket.handshake.auth.token;

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

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const pubClient = redis;
const subClient = redis.duplicate();

io.adapter(createAdapter(pubClient, subClient));

server.listen(PORT, () => {
  console.log(`Socket Server is running on ${PORT}`);
});
