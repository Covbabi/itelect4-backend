import { Router, type Request, type Response } from "express";
import { Claim } from "../models/Claim";

export const claimRouter = Router();

// GET /api/claims
claimRouter.get("/", async (_req: Request, res: Response) => {
  const claims = await Claim.find().sort({ submittedAt: -1 });
  res.json(claims);
});

// POST /api/claims
claimRouter.post("/", async (req: Request, res: Response) => {
  const { itemId, claimedBy, itemTitle } = req.body;
  const newClaim = await Claim.create({ itemId, claimedBy, itemTitle });
  res.status(201).json(newClaim);
});

// PATCH /api/claims/:id
claimRouter.patch("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { status, verifiedBy } = req.body;
  const updatedClaim = await Claim.findByIdAndUpdate(
    req.params.id,
    { status, verifiedBy },
    { new: true }
  );
  if (!updatedClaim) {
    res.status(404).json({ message: "Claim record not found" });
    return;
  }
  res.json(updatedClaim);
});