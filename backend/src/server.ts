// dotenv loads .env locally; Railway injects env vars directly (no .env file needed)
import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import authRoutes from "./routes/auth";
import messageRoutes from "./routes/messages";
import userRoutes from "./routes/users";
import Message from "./models/Message";
import { runSeedGuard } from "./utils/seedGuard";

const app = express();
const httpServer = http.createServer(app);

// ─── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((o) => o.trim())
  : ["*"];

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? "*" : allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// ─── REST Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Socket.io ─────────────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins.includes("*") ? "*" : allowedOrigins,
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

// Verify JWT on every socket connection
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication error: no token"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      user: { id: string; username: string };
    };
    (socket as any).user = decoded.user;
    next();
  } catch {
    next(new Error("Authentication error: invalid token"));
  }
});

io.on("connection", (socket) => {
  const user = (socket as any).user as { id: string; username: string };

  // Each user joins a private room identified by their userId
  socket.join(user.id);

  socket.on(
    "message:send",
    async (data: { receiverId: string; content: string }) => {
      const { receiverId, content } = data;
      if (!receiverId || !content?.trim()) return;

      try {
        const message = await Message.create({
          senderId: user.id,
          receiverId,
          content: content.trim(),
        });

        const payload = {
          _id: message._id.toString(),
          content: message.content,
          senderId: { id: user.id, username: user.username },
          receiverId,
          createdAt: message.createdAt,
        };

        // Deliver to receiver's private room + back to sender for confirmation
        io.to(receiverId).emit("message:receive", payload);
        io.to(user.id).emit("message:receive", payload);
      } catch (err: any) {
        socket.emit("message:error", { msg: "Failed to send message" });
      }
    }
  );

  socket.on("disconnect", () => {
    // intentionally silent in production
  });
});

// ─── MongoDB + Start ───────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT ?? "5000", 10);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(async () => {
    console.log("[DB] Connected to MongoDB Atlas");

    // Clean up old demo/test users on every startup
    await runSeedGuard();

    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`[Server] Running on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error("[DB] Connection failed:", err.message);
    process.exit(1);
  });
