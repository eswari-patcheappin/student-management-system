import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully",
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);

    const errorName =
      error instanceof Error ? error.name : "UnknownError";

    return NextResponse.json({
      success: false,
      message: "Database connection failed",
      errorType:errorName,
    },
      {status: 500}  
    );
  }
}