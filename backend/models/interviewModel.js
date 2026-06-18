import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tutor",
      required: true,
    },

    questions: { type: [String], default: [] },
    answers: { type: [String], default: [] },

    score: { type: Number, default: 0 },
    feedback: { type: String, default: "" },

    result: {
      type: String,
      enum: ["pending", "pass", "fail"],
      default: "pending",
    },

    startedAt: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Interview", interviewSchema);
