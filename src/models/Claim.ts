import { Schema, model } from "mongoose";
import type { ClaimDoc } from "../types/index";

const claimSchema = new Schema<ClaimDoc>({
  itemId: { type: String, required: true },
  claimedBy: { type: Number, required: true },
  verifiedBy: { type: Number },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "verified"], default: "pending" },
  itemTitle: { type: String, required: true },
});

claimSchema.set("toJSON", {
  transform(_doc, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Claim = model<ClaimDoc>("Claim", claimSchema);