import mongoose from "mongoose";

const allocationRunSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["completed", "failed"],
      default: "completed",
    },

    totalStudents: {
      type: Number,
      default: 0,
    },

    allocatedCount: {
      type: Number,
      default: 0,
    },

    unallocatedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AllocationRun ||
  mongoose.model("AllocationRun", allocationRunSchema);