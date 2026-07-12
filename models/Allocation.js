import mongoose from "mongoose";

const allocationSchema = new mongoose.Schema(
  {
    run: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AllocationRun",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    status: {
      type: String,
      enum: ["allocated", "unallocated"],
      required: true,
    },

    category: {
      type: String,
      enum: ["General", "OBC", "SC", "ST"],
    },

    allocatedPreference: Number,

    seatPool: String,

    reason: String,
  },
  {
    timestamps: true,
  }
);

allocationSchema.index(
  {
    run: 1,
    student: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.models.Allocation ||
  mongoose.model("Allocation", allocationSchema);