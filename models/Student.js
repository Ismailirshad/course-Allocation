import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    marks: { type: Number, required: true, min: 0, max: 100 },
    category: {
      type: String,
      enum: ["General", "OBC", "SC", "ST"],
      required: true,
    },
    applicationDate: { type: Date, required: true },
    preference1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    preference2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    preference3: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true },
);

studentSchema.index({ marks: -1, applicationDate: 1 });

export default mongoose.models.Student ||
  mongoose.model("Student", studentSchema);
