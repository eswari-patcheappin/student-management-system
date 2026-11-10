
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const { name, email, phone, department, year } = body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !phone ||
      !department ||
      year === undefined ||
      year === null ||
      year === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    // Create student in MongoDB
    const student = await Student.create({
      name,
      email,
      phone,
      department,
      year,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Student added successfully",
        student,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Add student error:", error);

    // Duplicate email
    if (
      error instanceof mongoose.Error.ValidationError
    ) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 }
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 409 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add student",
      },
      { status: 500 }
    );
  }
}



export async function GET() {
  try {
    await connectDB();

    const students = await Student.find()
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        message: "Students fetched successfully",
        total: students.length,
        students,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch students error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch students",
      },
      { status: 500 }
    );
  }
}
