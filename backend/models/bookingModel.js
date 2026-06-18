import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },

    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
    },

    problemText:{
      type:String,
      required:true
    },
    problemImage:{
      type:String
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    duration: Number,

    meetingLink: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "rejected",
      ],
      default: "pending",
      index: true,
    },

    cancelledBy: {
      type: String,
      enum: ["student", "tutor", "system"],
    },

    cancellationReason: String,

    studentNotes: String,
    tutorNotes: String,

    isReviewed: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

  tutorProofImage: {
  type: String
},

studentProofImage: {
  type: String
},

isTutorUploaded: {
  type: Boolean,
  default: false
},

isStudentUploaded: {
  type: Boolean,
  default: false
},

proofUploadedAt: {
  type: Date
},
proofVerified: {
  type: Boolean,
  default: false
},
paymentStatus: {
  type: String,
  enum: ["pending", "paid", "failed"],
  default: "pending"
},
  },

  { timestamps: true }
);

// indexes
bookingSchema.index({ tutor: 1, date: 1 });
bookingSchema.index({ student: 1, date: 1 });

// prevent double booking
bookingSchema.index(
  { tutor: 1, date: 1, startTime: 1 },
  { unique: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;