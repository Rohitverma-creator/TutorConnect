import mongoose from "mongoose";
import Feedback from "../models/feedbackModel.js";
import Booking from "../models/bookingModel.js";

export const createFeedback = async (req, res) => {
  try {
    const { bookingId, rating, review } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.status !== "completed") {
      return res.json({ success: false, message: "Session not completed" });
    }

    const existing = await Feedback.findOne({ booking: bookingId });

    if (existing) {
      return res.json({ success: false, message: "Already submitted" });
    }

    const feedback = await Feedback.create({
      student: req.userId,
      tutor: booking.tutor,
      booking: bookingId,
      rating,
      review,
    });

    await Booking.findByIdAndUpdate(bookingId, {
      isReviewed: true,
    });

    res.json({ success: true, feedback });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const getTutorFeedback = async (req, res) => {
  try {
    const { tutorId } = req.params;

    const feedbacks = await Feedback.find({ tutor: tutorId })
      .populate("student", "name image")
      .sort({ createdAt: -1 });

    res.json({ success: true, feedbacks });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const getAverageRating = async (req, res) => {
  try {
    const { tutorId } = req.params;

    const result = await Feedback.aggregate([
      {
        $match: {
          tutor: new mongoose.Types.ObjectId(tutorId),
        },
      },
      {
        $group: {
          _id: "$tutor",
          avgRating: { $avg: "$rating" },
          total: { $sum: 1 },
        },
      },
    ]);

    const data = result[0] || { avgRating: 0, total: 0 };

    res.json({
      success: true,
      avgRating: Number(data.avgRating.toFixed(1)),
      total: data.total,
    });

  } catch (err) {
    console.error("RATING ERROR:", err);
    res.status(500).json({ success: false });
  }
};