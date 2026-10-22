import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/db";

const DEFAULT_PORT = Number(process.env.PORT) || 4000;

async function startServer() {
  await connectDB();

  app.listen(DEFAULT_PORT, () => {
    console.log(`Campus Lost & Found API running on http://localhost:${DEFAULT_PORT}`);
  });
}

startServer().catch((err: unknown) => {
  console.error("Could not start the server:", err);
  process.exit(1);
});