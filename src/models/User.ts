import { Schema, model } from "mongoose";
import type { UserDoc } from "../types/index";

const userSchema = new Schema<UserDoc>({
  name: { type: String, required: [true, "User name is required"], trim: true },
  email: { type: String, required: [true, "User email is required"], unique: true, lowercase: true, trim: true },
  role: { type: String, enum: ["student", "admin"], default: "student" },
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