import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";

export async function GET() {
  try {
    await connectDB();

    const students = await Student.find()
      .populate("preference1")
      .populate("preference2")
      .populate("preference3")
      .sort({
        marks: -1,
        applicationDate: 1,
      });

    return NextResponse.json({
      success: true,
      students,
    });
  } catch (error) {
    console.log("Error i get students api", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch students",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const student = await Student.create(body);

    return NextResponse.json(
      {
        success: true,
        student,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to register student",
      },
      {
        status: 400,
      },
    );
  }
}
