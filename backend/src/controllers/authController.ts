import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const signToken = (id: string, username: string): string => {
  return jwt.sign(
    { user: { id, username } },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" } as jwt.SignOptions
  );
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ msg: "Username and password are required" });
    return;
  }

  try {
    const existing = await User.findOne({ username: username.toLowerCase() });
    if (existing) {
      res.status(409).json({ msg: "Username is already taken" });
      return;
    }

    const user = await User.create({ username: username.toLowerCase(), password });
    const token = signToken(user._id.toString(), user.username);

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (err: any) {
    res.status(500).json({ msg: err.message || "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ msg: "Username and password are required" });
    return;
  }

  try {
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      res.status(401).json({ msg: "Invalid username or password" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ msg: "Invalid username or password" });
      return;
    }

    const token = signToken(user._id.toString(), user.username);

    res.status(200).json({
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (err: any) {
    res.status(500).json({ msg: err.message || "Server error" });
  }
};
