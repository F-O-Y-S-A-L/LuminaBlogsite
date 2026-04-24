import mongoose from "mongoose";

export async function dbConnect(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    console.log("DB Connected Successfully");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
  } catch (error) {
    console.log("Datebase connection failed", error);
    throw new Error("Database connection failed");
  }
}

