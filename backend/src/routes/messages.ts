import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import Message from "../models/Message";

const router = Router();

// GET /api/messages/:userId — conversation between current user and :userId
router.get(
  "/:userId",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const me = req.user!.id;
    const other = req.params.userId;

    try {
      const messages = await Message.find({
        $or: [
          { senderId: me, receiverId: other },
          { senderId: other, receiverId: me },
        ],
      })
        .sort({ createdAt: 1 })
        .populate("senderId", "username")
        .populate("receiverId", "username");

      res.json(messages);
    } catch (err: any) {
      res.status(500).json({ msg: err.message || "Server error" });
    }
  }
);

// POST /api/messages — save a message
router.post(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { receiverId, content } = req.body;

    if (!receiverId || !content?.trim()) {
      res.status(400).json({ msg: "receiverId and content are required" });
      return;
    }

    try {
      const message = await Message.create({
        senderId: req.user!.id,
        receiverId,
        content: content.trim(),
      });

      const populated = await Message.findById(message._id)
        .populate("senderId", "username")
        .populate("receiverId", "username");

      res.status(201).json(populated);
    } catch (err: any) {
      res.status(500).json({ msg: err.message || "Server error" });
    }
  }
);

export default router;
