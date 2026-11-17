import { NextResponse } from "next/server";
import { connection } from "next/server";
import { getStorageInfo } from "@/lib/server/bookings";
import { connectToDatabase, getSanitizedMongoUri } from "@/lib/server/mongodb";
import mongoose from "mongoose";

export async function GET() {
  await connection();
  const rawEnv = process.env.MONGODB_URI;
  const hasEnv = Boolean(rawEnv && rawEnv.trim().length > 0);
  const sanitizedUri = getSanitizedMongoUri();

  let mongoError: string | null = null;
  let isConnected = false;

  if (sanitizedUri) {
    try {
      const conn = await connectToDatabase();
      isConnected = Boolean(conn);
      if (!conn) {
        // Run direct connect to capture exact error
        await mongoose.connect(sanitizedUri, {
          dbName: "fithub_studio",
          serverSelectionTimeoutMS: 5000,
        });
      }
    } catch (e: unknown) {
      mongoError = e instanceof Error ? e.message : String(e);
    }
  }

  const storage = await getStorageInfo();

  return NextResponse.json({
    status: "ok",
    hasEnv,
    envLength: rawEnv ? rawEnv.length : 0,
    sanitizedPrefix: sanitizedUri ? sanitizedUri.slice(0, 18) + "..." : null,
    sanitizedSuffix: sanitizedUri ? "..." + sanitizedUri.slice(-25) : null,
    isConnected,
    readyState: mongoose.connection.readyState,
    storageType: storage.type,
    mongoError,
  });
}
