import "dotenv/config";
import { app } from "./app";
import { connectDB } from "./config/db";

const DEFAULT_PORT = Number(process.env.PORT) || 4000;

const startServer = (port: number): void => {
  const server = app.listen(port, () => {
    console.log(`Campus Lost & Found API running on http://localhost:${port}`);
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      const nextPort = port + 1;
      if (nextPort <= 4100) {
        console.warn(`Port ${port} is busy; retrying on port ${nextPort}...`);
        startServer(nextPort);
        return;
      }
    }

    throw err;
  });
};

connectDB().catch((err: unknown) => {
  console.error("Could not connect to MongoDB Atlas:", err);
});

startServer(DEFAULT_PORT);