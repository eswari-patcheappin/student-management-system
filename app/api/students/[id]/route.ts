
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid student ID",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Student fetched successfully",
      student,
    });
  } catch (error) {
    console.error("Error fetching student:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch student",
      },
      { status: 500 }
    );
  }
}


export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid student ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email, phone, department, year } = body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof phone !== "string" ||
      typeof department !== "string" ||
      name.trim() === "" ||
      email.trim() === "" ||
      department.trim() === "" ||
      !/^\d{10}$/.test(phone) ||
      ![1, 2, 3, 4].includes(Number(year))
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid student details" },
        { status: 400 }
      );
    }

    await connectDB();

    const student = await Student.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        email: email.trim(),
        phone,
        department: department.trim(),
        year: Number(year),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Student updated successfully",
      student,
    });
  } catch (error: unknown) {
    console.error("Update student error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, message: "Invalid JSON request" },
        { status: 400 }
      );
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update student" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.isObjectIdOrHexString(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid student ID",
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Find and delete the student
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Student deleted successfully",
        student: deletedStudent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete student error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete student",
      },
      { status: 500 }
    );
  }
}
