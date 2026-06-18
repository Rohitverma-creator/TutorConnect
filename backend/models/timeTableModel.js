import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  tutorRecommended: {
    type: Boolean,
    default: false,
  },
});

const daySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  slots: [slotSchema],
});

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    default: 1,
  },
});

const timetableSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  
  subjects: {
    type: [subjectSchema],
    default: [],
  },

 
  days: {
    type: [String],
    default: [],
  },

  hoursPerDay: {
    type: Number,
    required: true,
  },

  level: {
    type: String,
    enum: ["school", "college", "exam"],
    default: "school",
  },

  timetable: {
    type: [daySchema],
    default: [],
  },

  isAIGenerated: {
    type: Boolean,
    default: true,
  },

  aiModel: {
    type: String,
    default: "openrouter",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Timetable", timetableSchema);