import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import User from "../models/User";

const router = Router();

// GET /api/users — all users except current user
router.get(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const users = await User.find(
        { _id: { $ne: req.user!.id } },
        { password: 0 } // never send password
      ).sort({ username: 1 });

      res.json(users);
    } catch (err: any) {
      res.status(500).json({ msg: err.message || "Server error" });
    }
  }
);

export default router;
