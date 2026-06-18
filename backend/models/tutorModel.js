import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      default: "tutor",
    },

    image: { type: String, required: true },
    qualification: { type: String, required: true },
    subject: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: false }, // manual toggle
    isOnline: { type: Boolean, default: false }, // login state
    isBusy: { type: Boolean, default: false }, // session running
    lastActive: { type: Date, default: Date.now },
    fees: { type: Number, required: true },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    students: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    hours: { type: Number, default: 0 },
    sessions: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { minimize: false },
);

const tutorModel =
  mongoose.models.Tutor || mongoose.model("Tutor", tutorSchema);

export default tutorModel;
