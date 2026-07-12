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

export async function GET() {
  try {
    await connectDB();

    const courses = await Course.find({ isActive: true }).sort({
      name: 1,
    });

    return NextResponse.json({
      success: true,
      courses,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch courses",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const payload = courseSchema.parse(await request.json());

    const reservedTotal =
      payload.reservedSeats.OBC +
      payload.reservedSeats.SC +
      payload.reservedSeats.ST;

    if (reservedTotal > payload.totalSeats) {
      return NextResponse.json(
        {
          success: false,
          message: "Reserved seats cannot exceed total seats.",
        },
        {
          status: 400,
        }
      );
    }

    const course = await Course.create(payload);

    return NextResponse.json(
      {
        success: true,
        message: "Course created successfully.",
        course,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create course.",
      },
      {
        status: 400,
      }
    );
  }
}