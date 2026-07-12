import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  code: {
    type: String,
    required: true,
    unique: true,
  },

  totalSeats: {
    type: Number,
    required: true,
  },

  reservedSeats: {
    OBC: {
      type: Number,
      default: 0,
    },
    SC: {
      type: Number,
      default: 0,
    },
    ST: {
      type: Number,
      default: 0,
    },
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.models.Course ||
  mongoose.model("Course", courseSchema);