import "dotenv/config";
import { app } from "./app";
import { connectDB } from "./config/db";

const PORT = Number(process.env.PORT) || 4000;

connectDB().catch((err: unknown) => {
  console.error("Could not connect to MongoDB Atlas:", err);
});

app.listen(PORT, () => {
  console.log(`Campus Lost & Found API running on http://localhost:${PORT}`);
});