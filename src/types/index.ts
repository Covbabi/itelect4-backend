export interface ItemDoc {
  title: string;
  description: string;
  location: string;
  reportedBy: number; // match with Option A (number) or string with Option B
  status: "lost" | "found";
  createdAt?: Date;
}

export interface UserDoc {
  name: string;
  email: string;
  password?: string; // Add password here
  role?: string;
  isActive?: boolean;
}

export interface ClaimDoc {
  itemId: string;
  claimedBy: number;
  verifiedBy?: number;
  submittedAt: Date;
  status: "pending" | "verified";
  itemTitle: string;
}