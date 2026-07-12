import Allocation from "@/models/Allocation";
import AllocationRun from "@/models/AllocationRun";
import Course from "@/models/Course";
import Student from "@/models/Student";


export async function getDashboardData(){
    // Latest Allocation Run
    const run = await AllocationRun.findOne().sort({ createdAt: -1 });

    if (!run) {
      return {
        run: {
          totalStudents: 0,
          allocatedCount: 0,
          unallocatedCount: 0,
        },
        allocatedStudents: [],
        availableSeats: [],
        courseStatistics: [],
      };
    }

    // Allocations of latest run
    const allocations = await Allocation.find({
      run: run._id,
      status: "allocated",
    })
      .populate("student")
      .populate("course");

    const courses = await Course.find();

    // -----------------------
    // Allocated Students Table
    // -----------------------

    const allocatedStudents = allocations.map((item) => ({
      studentId: item.student.studentId,
      name: item.student.name,
      category: item.student.category,
      marks: item.student.marks,
      course: item.course.name,
      allocatedPreference: item.allocatedPreference,
      seatPool: item.seatPool,
    }));

    // -----------------------
    // Available Seats
    // -----------------------

    const availableSeats = courses.map((course) => {
      const courseAllocations = allocations.filter(
        (a) => a.course._id.toString() === course._id.toString()
      );

      const openAllocated = courseAllocations.filter(
        (a) => a.seatPool === "Open"
      ).length;

      const obcAllocated = courseAllocations.filter(
        (a) => a.seatPool === "OBC"
      ).length;

      const scAllocated = courseAllocations.filter(
        (a) => a.seatPool === "SC"
      ).length;

      const stAllocated = courseAllocations.filter(
        (a) => a.seatPool === "ST"
      ).length;

      const totalOpenSeats =
        course.totalSeats -
        course.reservedSeats.OBC -
        course.reservedSeats.SC -
        course.reservedSeats.ST;

      return {
        course: course.name,

        open: totalOpenSeats - openAllocated,

        OBC: course.reservedSeats.OBC - obcAllocated,

        SC: course.reservedSeats.SC - scAllocated,

        ST: course.reservedSeats.ST - stAllocated,
      };
    });

    // -----------------------
    // Course Statistics
    // -----------------------

    const students = await Student.find();

    const courseStatistics = courses.map((course) => {
      const allocated = allocations.filter(
        (a) => a.course._id.toString() === course._id.toString()
      ).length;

      const requestCount = students.filter((student) => {
        return (
          student.preference1?.toString() === course._id.toString() ||
          student.preference2?.toString() === course._id.toString() ||
          student.preference3?.toString() === course._id.toString()
        );
      }).length;

      const rejected = Math.max(requestCount - allocated, 0);

      const rejectionRate =
        requestCount === 0
          ? 0
          : Number(((rejected / requestCount) * 100).toFixed(1));

      return {
        course: course.name,
        allocated,
        totalSeats: course.totalSeats,
        requestCount,
        rejectionRate,
      };
    });

      return {
    run,
    allocatedStudents,
    availableSeats,
    courseStatistics,
  };

  }