
import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error("MONGODB_URI is missing");
  }

  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose;
    }

    await mongoose.connect(uri);

    console.log("MongoDB Connected Successfully");

    return mongoose;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
