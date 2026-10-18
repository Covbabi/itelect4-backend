import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { authRouter } from "./routes/auth";
import { itemRouter } from "./routes/items";
import { userRouter } from "./routes/users";
import { claimRouter } from "./routes/claim";
import { itemsRouter, claimsRouter } from "./routes/Submission";

export const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  await connectDB();
  next();
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

app.use("/api/auth", authRouter);
app.use("/api/items", itemRouter);
app.use("/api/users", userRouter);
app.use("/api/claims", claimRouter);
app.use("/api/submissions/items", itemsRouter);
app.use("/api/submissions/claims", claimsRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `No endpoint route found for ${req.method} ${req.originalUrl}`,
  });
});

app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        message: "Validation failed",
        errors: Object.values(err.errors).map((e) => e.message),
      });
      return;
    }

    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json({
        message: `"${err.value}" is not a valid ID format`,
      });
      return;
    }

    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
);

export default app;