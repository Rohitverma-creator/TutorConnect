import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

import Tutor from "../models/tutorModel.js";
import Booking from "../models/bookingModel.js";
import Feedback from "../models/feedbackModel.js";
import Payment from "../models/paymentModel.js";
import tutorModel from "../models/tutorModel.js";
import Interview from "../models/interviewModel.js";


export const addTutor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      qualification,
      subject,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;

    // Validation
    if (
      !name ||
      !email ||
      !password ||
      !qualification ||
      !subject ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "All fields required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    if (password.length < 6) {
      return res.json({ success: false, message: "Weak password" });
    }

    // Check existing tutor
    const exist = await Tutor.findOne({ email });
    if (exist) {
      return res.json({ success: false, message: "Tutor already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl = "";
    if (imageFile) {
      const result = await cloudinary.uploader.upload(imageFile.path);
      imageUrl = result.secure_url;
    }

    const tutor = new Tutor({
      name,
      email,
      password: hashedPassword,
      qualification,
      subject,
      experience,
      about,
      fees,
      address,
      image: imageUrl,
      date: Date.now(),
      status: "pending",
    });

    const newTutor = await tutor.save();

    // JWT
    const token = jwt.sign(
      { id: newTutor._id, role: "tutor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, tutor: newTutor });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const loginTutor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const tutor = await Tutor.findOne({ email });
    if (!tutor) {
      return res.json({ success: false, message: "Tutor not found" });
    }

    const match = await bcrypt.compare(password, tutor.password);
    if (!match) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: tutor._id, role: "tutor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await Tutor.findByIdAndUpdate(tutor._id, {
      isOnline: true,
      lastActive: new Date(),
    });

    res.json({
      success: true,
      message: "Tutor login successfully",
      tutor,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getCurrentTutor = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.user.id).select("-password");

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found",
      });
    }

    res.status(200).json({
      success: true,
      tutor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getApprovedTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find({ status: "approved" }).select("-password");
    res.status(200).json({
      success: true,
      tutors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPendingTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find({ status: "pending" }).select("-password");
    res.json({ success: true, tutors });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//  Update Tutor Status (Admin)
export const updateTutorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const tutor = await Tutor.findByIdAndUpdate(id, { status }, { new: true });

    res.json({ success: true, tutor });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const toggleAvailability = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.userId);

    if (!tutor) {
      return res
        .status(404)
        .json({ success: false, message: "Tutor not found" });
    }

    tutor.available = !tutor.available;
    tutor.lastActive = new Date();

    if (!tutor.available) {
      tutor.isBusy = false;
    }

    await tutor.save();

    res.json({
      success: true,
      available: tutor.available,
    });
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).json({ success: false });
  }
};

export const getAvailableTutors = async (req, res) => {
  try {
    const { subject } = req.query;

    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);

    const tutors = await Tutor.find({
      subject,
      available: true,
      isOnline: true,
      lastActive: { $gte: fiveMinAgo },
      status: "approved",
    });

    res.json({
      success: true,
      tutors,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const logoutTutor = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ success: true, message: "Tutor logged out successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
 
export const getTutorStats = async (req, res) => {
  try {
    const tutorId = req.userId;

    if (!tutorId) {
      return res.status(400).json({ success: false, message: "No tutorId" });
    }

    const students = await Booking.distinct("student", {
      tutor: tutorId,
      status: "completed",
    });

    const sessions = await Booking.countDocuments({
      tutor: tutorId,
      status: "completed",
    });

    const ratingData = await Feedback.aggregate([
      {
        $match: {
          tutor: new mongoose.Types.ObjectId(tutorId),
        },
      },
      {
        $group: {
          _id: null,
          avg: { $avg: "$rating" },
        },
      },
    ]);

    res.json({
      success: true,
      stats: {
        totalStudents: students.length,
        totalSessions: sessions,
        totalHours: sessions,
        avgRating: ratingData[0]?.avg?.toFixed(1) || 0,
      },
    });
  } catch (err) {
    console.log("TUTOR STATS ERROR:", err.message);
    res.status(500).json({ success: false });
  }
};


export const getTutorEarnings = async (req, res) => {
  try {
    const tutorId = req.userId;

    if (!tutorId) {
      return res.status(400).json({
        success: false,
        message: "Tutor not found",
      });
    }

   const earningsData = await Payment.aggregate([
  {
    $match: {
      tutor: new mongoose.Types.ObjectId(tutorId),
      status: "paid",
    },
  },
  {
    $group: {
      _id: null,
      totalEarnings: { $sum: "$amount" },
    },
  },
]);

    const data = earningsData[0] || {
      totalEarnings: 0,
      totalTransactions: 0,
    };

    res.json({
      success: true,
      earnings: {
        totalEarnings: data.totalEarnings,
        totalTransactions: data.totalTransactions,
      },
    });
  } catch (err) {
    console.log("EARNINGS ERROR:", err);
    res.status(500).json({ success: false });
  }
};



export const getRecommendedTutors = async (req, res) => {
  try {
    const { subject, maxFees } = req.body;

    const tutors = await tutorModel.aggregate([
      {
        $match: {
          subject: { $regex: subject, $options: "i" },
          fees: { $lte: Number(maxFees) },
          available: true,
          isBusy: false,
          status: "approved",
        },
      },
      {
        $lookup: {
          from: "feedbacks",
          localField: "_id",
          foreignField: "tutor",
          as: "reviews",
        },
      },
      {
        $lookup: {
          from: "interviews",
          localField: "_id",
          foreignField: "tutor",
          as: "interview",
        },
      },
      {
        $addFields: {
          avgRating: { $ifNull: [{ $avg: "$reviews.rating" }, 0] },
          aiScore: {
            $ifNull: [{ $arrayElemAt: ["$interview.score", 0] }, 0],
          },
       experienceNum: {
  $toDouble: { $trim: { input: "$experience" } }
}
        },
      },
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ["$avgRating", 0.4] },
              { $multiply: ["$experienceNum", 0.3] },
              { $multiply: ["$aiScore", 0.3] },
            ],
          },
        },
      },
      { $sort: { score: -1 } },
      { $limit: 3 },
    ]);

    res.json({
      success: true,
      tutors,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};