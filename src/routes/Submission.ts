import { Router } from "express";
import type { Request, Response } from "express";
import { Item } from "../models/Item";
import { Claim } from "../models/Claim";
import { requireAuth } from "../middleware/auth";

export const itemsRouter = Router();
export const claimsRouter = Router();

itemsRouter.use(requireAuth);
claimsRouter.use(requireAuth);

// ============ ITEMS ROUTES ============

// GET /api/items - Get all items
itemsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/items/:id - Get single item by ID
itemsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (error: any) {
    res.status(400).json({ message: "Invalid ID format" });
  }
});

// POST /api/items - Create item (Report lost/found item)
itemsRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, location, status } = req.body;

    const item = new Item({
      title,
      description,
      location,
      reportedBy: req.userId,
      status,
    });

    await item.save();
    await item.populate("reportedBy", "name email");
    res.status(201).json(item);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return res.status(400).json({ errors: messages });
    }
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/items/:id - Update item
itemsRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const { title, description, location, status } = req.body;

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { title, description, location, status },
      { new: true, runValidators: true }
    ).populate("reportedBy", "name email");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return res.status(400).json({ errors: messages });
    }
    res.status(400).json({ message: "Invalid ID format or request data" });
  }
});

// DELETE /api/items/:id - Delete item
itemsRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ message: "Invalid ID format" });
  }
});

// ============ CLAIMS ROUTES ============

// GET /api/claims - Get all claims
claimsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const claims = await Claim.find()
      .populate("itemId")
      .populate("claimedBy", "name email")
      .populate("verifiedBy", "name email")
      .sort({ submittedAt: -1 });
    res.json(claims);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/claims/:id - Get single claim by ID
claimsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate("itemId")
      .populate("claimedBy", "name email")
      .populate("verifiedBy", "name email");

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    res.json(claim);
  } catch (error: any) {
    res.status(400).json({ message: "Invalid ID format" });
  }
});

// POST /api/claims - Create new claim for an item
claimsRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "itemId is required" });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const claim = new Claim({
      itemId,
      claimedBy: req.userId,
      status: "pending",
    });

    await claim.save();
    await claim.populate("itemId");
    await claim.populate("claimedBy", "name email");
    res.status(201).json(claim);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return res.status(400).json({ errors: messages });
    }
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/claims/:id/verify - Verify a claim (admin only)
claimsRouter.put("/:id/verify", async (req: Request, res: Response) => {
  try {
    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      { status: "verified", verifiedBy: req.userId },
      { new: true }
    )
      .populate("itemId")
      .populate("claimedBy", "name email")
      .populate("verifiedBy", "name email");

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    res.json(claim);
  } catch (error: any) {
    res.status(400).json({ message: "Invalid ID format or request data" });
  }
});

// DELETE /api/claims/:id - Delete claim
claimsRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const claim = await Claim.findByIdAndDelete(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ message: "Invalid ID format" });
  }
});