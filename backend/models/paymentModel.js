import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
      default: null,
    },

    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmergencyRequest",
      default: null, 
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null, 
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
    },

    razorpayOrderId: {
      type: String,
      required: true,
    },

    razorpayPaymentId: String,
    razorpaySignature: String,

    method: String,

    paidAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);