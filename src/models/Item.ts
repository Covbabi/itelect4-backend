import { Schema, model } from "mongoose";
import type { ItemDoc } from "../types/index";

const itemSchema = new Schema<ItemDoc>(
  {
    title: { type: String, required: [true, "Item title is required"], trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: [true, "Location is required"], trim: true },
    reportedBy: { type: Number, required: true },
    status: { type: String, enum: ["lost", "found"], required: true },
  },
  { timestamps: true }
);

itemSchema.set("toJSON", {
  transform(_doc, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Item = model<ItemDoc>("Item", itemSchema);