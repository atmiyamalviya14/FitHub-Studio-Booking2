import "server-only";
import mongoose from "mongoose";

/**
 * Global cache to prevent multiple connections during Next.js hot reload and serverless invocations.
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
  const uri = process.env.MONGODB_URI;
  return Boolean(uri && uri.trim().length > 0);
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri || !uri.trim()) {
    return null;
  }

  // 1. Return immediately if existing connection is active and ready
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // 2. Initialize connection promise if not present or disconnected
  if (!cached?.promise || mongoose.connection.readyState === 0) {
    const opts: mongoose.ConnectOptions = {
      dbName: "fithub_studio",
      serverSelectionTimeoutMS: 8000,
      bufferCommands: false,
    };

    cached!.promise = mongoose
      .connect(uri.trim(), opts)
      .then((m) => {
        cached!.conn = m;
        return m;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        cached!.promise = null;
        cached!.conn = null;
        throw err;
      });
  }

  // 3. Await connection resolution
  try {
    cached!.conn = await cached!.promise;
    return cached!.conn;
  } catch (e) {
    cached!.promise = null;
    cached!.conn = null;
    console.error("Failed to establish MongoDB connection:", e);
    return null;
  }
}
