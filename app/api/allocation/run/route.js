import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import Student from "@/models/Student";
import Course from "@/models/Course";
import Allocation from "@/models/Allocation";
import AllocationRun from "@/models/AllocationRun";

export async function POST() {
  try {
    await connectDB();

    const students = await Student.find().sort({
      marks: -1,
      applicationDate: 1,
    });

    const courses = await Course.find({ isActive: true });

    const run = await AllocationRun.create({
      totalStudents: students.length,
      allocatedCount: 0,
      unallocatedCount: 0,
      status: "completed",
    });

    // Build seat tracker
    const seatTracker = {};

    for (const course of courses) {
      seatTracker[course._id] = {
        open:
          course.totalSeats -
          course.reservedSeats.OBC -
          course.reservedSeats.SC -
          course.reservedSeats.ST,

        OBC: course.reservedSeats.OBC,
        SC: course.reservedSeats.SC,
        ST: course.reservedSeats.ST,
      };
    }

    let allocatedCount = 0;
    let unallocatedCount = 0;

    for (const student of students) {
      const preferences = [
        student.preference1,
        student.preference2,
        student.preference3,
      ];

      let allocated = false;

      for (let priority = 0; priority < preferences.length; priority++) {
        const courseId = preferences[priority];

        if (!courseId) continue;

        const seats = seatTracker[courseId];
        if (!seats) continue;

        let seatPool = null;

        // Everyone competes for open seats first
        if (seats.open > 0) {
          seats.open--;
          seatPool = "Open";
        }

        // Reserved category seat
        else if (
          student.category !== "General" &&
          seats[student.category] > 0
        ) {
          seats[student.category]--;
          seatPool = student.category;
        }

        if (!seatPool) continue;

        await Allocation.create({
          run: run._id,
          student: student._id,
          course: courseId,
          status: "allocated",
          category:
            seatPool === "Open" ? "General" : student.category,
          allocatedPreference: priority + 1,
          seatPool,
        });

        allocated = true;
        allocatedCount++;
        break;
      }

      if (!allocated) {
        await Allocation.create({
          run: run._id,
          student: student._id,
          status: "unallocated",
          reason: "No seats available in preferred courses",
        });

        unallocatedCount++;
      }
    }

    run.allocatedCount = allocatedCount;
    run.unallocatedCount = unallocatedCount;

    await run.save();

    return NextResponse.json({
      success: true,
      message: "Allocation completed successfully.",
      runId: run._id,
      totalStudents: students.length,
      allocated: allocatedCount,
      unallocated: unallocatedCount,
    });
  } catch (error) {
    console.log("Error in allocation controller", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}