import "server-only";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global cache to prevent multiple connections during Next.js hot reload in development.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null };
}

export function isMongoConfigured(): boolean {
  return Boolean(MONGODB_URI && MONGODB_URI.trim().length > 0);
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!isMongoConfigured()) {
    return null;
  }

  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then((m) => {
        return m;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        cached!.promise = null;
        return null as unknown as typeof mongoose;
      });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    console.error("Failed to establish MongoDB connection:", e);
    return null;
  }

  return cached!.conn;
}
