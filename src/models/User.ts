import { Schema, model } from "mongoose";
import type { UserDoc } from "../types/index";

const userSchema = new Schema<UserDoc>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Add password field
  role: { type: String, default: "student" },
  isActive: { type: Boolean, default: true },
});

userSchema.set("toJSON", {
  transform(_doc, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const User = model<UserDoc>("User", userSchema);