import mongoose from "mongoose";

let connection: Promise<typeof mongoose> | null = null;

export function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is missing. Check your environment variables or .env configuration."
    );
  }

  if (connection === null) {
    connection = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 5000 })
      .then((m) => {
        console.log("Connected to Campus Lost & Found DB:", m.connection.name);
        return m;
      })
      .catch((err: unknown) => {
        connection = null;
        throw err;
      });
  }

  return connection;
}