import { Schema, model } from "mongoose";
import type { RecipeDoc } from "../types/index";

const recipeSchema = new Schema<RecipeDoc>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  category: {
    type: String,
    required: [true, "category is required"],
    enum: ["Breakfast", "Lunch", "Dinner", "Dessert"],
  },
  calories: { type: Number, min: 0, max: 2000 },
  createdAt: { type: Date, default: Date.now },
});

recipeSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Recipe = model<RecipeDoc>("Recipe", recipeSchema);
