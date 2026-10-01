import { Router, type Request, type Response } from "express";
import { Recipe } from "../models/Recipe";
import { requireAuth } from "../middleware/auth";
import type { NewRecipeBody } from "../types/index";

export const recipeRouter = Router();

recipeRouter.use(requireAuth);

interface IdParam {
  id: string;
}

recipeRouter.get("/", async (req: Request, res: Response) => {
  const recipes = await Recipe.find({
    userId: req.userId,
  }).sort({ createdAt: -1 });
  res.json(recipes);
});

recipeRouter.get(
  "/:id",
  async (req: Request<IdParam>, res: Response) => {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!recipe) {
      res.status(404).json({ message: "No recipe with that id" });
      return;
    }

    res.json(recipe);
  },
);

recipeRouter.post(
  "/",
  async (
    req: Request<unknown, unknown, NewRecipeBody>,
    res: Response,
  ) => {
    const recipe = await Recipe.create({
      ...req.body,
      userId: req.userId,
    });

    res.status(201).json(recipe);
  },
);

recipeRouter.patch(
  "/:id",
  async (
    req: Request<IdParam, unknown, Partial<NewRecipeBody>>,
    res: Response,
  ) => {
    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true },
    );

    if (!recipe) {
      res.status(404).json({ message: "No recipe with that id" });
      return;
    }

    res.json(recipe);
  },
);

recipeRouter.delete(
  "/:id",
  async (req: Request<IdParam>, res: Response) => {
    const recipe = await Recipe.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!recipe) {
      res.status(404).json({ message: "No recipe with that id" });
      return;
    }

    res.status(204).send();
  },
);
