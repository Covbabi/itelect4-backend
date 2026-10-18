import type { ItemDoc, UserDoc } from "../types/index";

export const INITIAL_USERS: UserDoc[] = [
  { name: "Juan dela Cruz", email: "juan@example.com", role: "student", isActive: true }, //[cite: 2]
  { name: "Maria Clara", email: "maria@example.com", role: "student", isActive: true }, //[cite: 2]
];

export const INITIAL_ITEMS: ItemDoc[] = [
  {
    title: "Blue Hydro Flask", //[cite: 2]
    description: "Found blue insulated bottle", //[cite: 2]
    location: "Library 2nd Floor", //[cite: 2]
    reportedBy: 1, //[cite: 2]
    status: "found", //[cite: 2]
  },
  {
    title: "Black Wallet", //[cite: 2]
    description: "Leather wallet with IDs", //[cite: 2]
    location: "Gymnasium", //[cite: 2]
    reportedBy: 2, //[cite: 2]
    status: "lost", //[cite: 2]
  },
];