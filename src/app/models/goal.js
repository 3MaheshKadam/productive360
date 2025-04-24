import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    type: {
      type: String,
      enum: ["daily", "weekly", "monthly", "6months", "yearly"],
      default: "daily",
    },
    status: {
      type: String,
      enum: ["not started", "in progress", "completed"],
      default: "not started",
    },
    motivationQuote: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Goal || mongoose.model("Goal", goalSchema);
