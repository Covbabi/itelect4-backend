import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { Item } from "./models/Item";
import { User } from "./models/User";
import { INITIAL_ITEMS, INITIAL_USERS } from "./data/seedData";

async function seed() {
  await connectDB();

  await Item.deleteMany({});
  await User.deleteMany({});

  await Item.insertMany(INITIAL_ITEMS);
  await User.insertMany(INITIAL_USERS);

  console.log(`Successfully seeded Campus Lost & Found database (${mongoose.connection.name}):`);
  console.log(`- ${INITIAL_ITEMS.length} items`);
  console.log(`- ${INITIAL_USERS.length} users`);

  await mongoose.disconnect();
}

seed().catch((err: unknown) => {
  console.error("Database seed failed:", err);
  process.exit(1);
});