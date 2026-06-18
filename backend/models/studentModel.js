import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: String,
    default: "student",
  },

  class: { type: String, required: true },

  image: {
    type: String,
  },

  address: { type: Object, default: { city: "", country: "" } },

  gender: { type: String, default: "Not Selected" },
  dob: { type: String, default: "Not Selected" },
  phone: { type: String, default: "0000000000" },

  isWaiting: { type: Boolean, default: false },
  currentRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmergencyRequest",
    default: null,
  },
});

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
