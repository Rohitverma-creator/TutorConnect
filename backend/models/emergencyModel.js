import mongoose from "mongoose";

const emergencyRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    problemText: {
      type: String,
      required: true,
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
      default: null,
    },
    notifiedTutors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tutor",
      },
    ],
    rejectedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tutor",
      },
    ],
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "completed",
        "rejected",
        "timeout",
        "expired",
      ],
      default: "pending",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    meetingLink: {
      type: String,
      default: "",
    },

    // 🔥 NEW FIELD
    requestExpiresAt: {
      type: Date,
    },

    fee: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);


emergencyRequestSchema.index(
  { requestExpiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const EmergencyRequest =
  mongoose.models.EmergencyRequest ||
  mongoose.model("EmergencyRequest", emergencyRequestSchema);

export default EmergencyRequest;