import { Router, type Request, type Response } from "express";
import { Item } from "../models/Item";

export const itemRouter = Router();

// GET /api/items
itemRouter.get("/", async (_req: Request, res: Response) => {
  const items = await Item.find().sort({ createdAt: -1 });
  res.json(items);
});

interface IdParam {
  id: string;
}

// GET /api/items/:id
itemRouter.get("/:id", async (req: Request<IdParam>, res: Response) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404).json({
      message: `No campus item found with ID "${req.params.id}"`,
    });
    return;
  }

  res.json(item);
});

// POST /api/items
itemRouter.post("/", async (req: Request, res: Response) => {
  const { title, description, location, reportedBy, status } = req.body;
  const newItem = await Item.create({
    title,
    description,
    location,
    reportedBy,
    status,
  });
  res.status(201).json(newItem);
});