export interface ItemDoc {
  title: string;
  description: string;
  location: string;
  reportedBy: number;
  status: "lost" | "found";
}

export interface UserDoc {
  name: string;
  email: string;
  role: "student" | "admin";
  isActive: boolean;
}

export interface ClaimDoc {
  itemId: string;
  claimedBy: number;
  verifiedBy?: number;
  submittedAt: Date;
  status: "pending" | "verified";
  itemTitle: string;
}