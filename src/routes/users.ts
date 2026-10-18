import { Router, type Request, type Response } from "express";
import { User } from "../models/User";

export const userRouter = Router();

// GET /api/users
userRouter.get("/", async (_req: Request, res: Response) => {
  const users = await User.find().sort({ name: 1 });
  res.json(users);
});

// POST /api/users
userRouter.post("/", async (req: Request, res: Response) => {
  const { name, email, role, isActive } = req.body;
  const newUser = await User.create({ name, email, role, isActive });
  res.status(201).json(newUser);
});