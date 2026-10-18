export interface ItemDoc {
  title: string;
  description: string;
  location: string;
  reportedBy: string; // ObjectId string reference to User
  status: "lost" | "found";
  createdAt?: Date;
}

export interface UserDoc {
  name: string;
  email: string;
  password: string; // password is required on the document when selected
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