import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { z } from "zod";

const courseSchema = z.object({
  name: z.string().trim().min(1, "Course name is required"),
  code: z.string().trim().min(1, "Course code is required").toUpperCase(),
  totalSeats: z.number().int().positive("Total seats must be a positive integer"),
  reservedSeats: z.object({
    OBC: z.number().int().nonnegative().default(0),
    SC: z.number().int().nonnegative().default(0),
    ST: z.number().int().nonnegative().default(0),
  }).default({}),
});

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const payload = courseSchema.partial().parse(await request.json());

    const course = await Course.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update course",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const course = await Course.findByIdAndUpdate(
      id,
      { isActive: false },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Course deactivated successfully",
      course,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to deactivate course",
      },
      { status: 500 }
    );
  }
}