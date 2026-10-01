import type { Types } from "mongoose";

export interface User {
  id:       number;
  name:     string;
  email:    string;
  role:     "student" | "admin" | "instructor";
  isActive: boolean;
}

export interface Recipe {
  id:          number;
  userId:      number;
  title:       string;
  description: string;
  category:    "Breakfast" | "Lunch" | "Dinner" | "Dessert";
  calories?:   number;
  createdAt:   Date;
}

export type UserDoc = Omit<User, "id"> & {
  password: string;
};

export type RecipeDoc = Omit<Recipe, "id" | "userId"> & {
  userId: Types.ObjectId;
};

export type NewRecipeBody = Pick<Recipe, "title" | "description" | "category" | "calories">;
