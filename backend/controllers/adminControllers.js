import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import Admin from "../models/adminModel.js";
import Student from "../models/studentModel.js";
import Tutor from "../models/tutorModel.js";
import EmergencyRequest from "../models/emergencyModel.js";
import Payment from "../models/paymentModel.js";
import Feedback from "../models/feedbackModel.js";

dotenv.config();

export const seedAdmin = async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({
      email: "admin@gmail.com",
    });

    if (existingAdmin) {
      return res.json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await Admin.create({
      name: "Super Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
    });

    res.json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Admin disabled",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        adminId: admin._id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    admin.lastLogin = new Date();
    await admin.save();

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTutors = await Tutor.countDocuments();
    const totalSessions = await EmergencyRequest.countDocuments();

    const revenue = await Payment.aggregate([
      { $match: { status: "success" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalTutors,
        totalSessions,
        totalRevenue: revenue[0]?.total || 0,
      },
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await EmergencyRequest.find()
      .populate("student tutor")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      sessions,
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("student tutor")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments,
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      students,
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getAllTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      tutors,
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const adminLogout = (req, res) => {
  res.clearCookie("adminToken");
  res.json({ success: true });
};   



export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("student", "name image")
      .populate("tutor", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      feedbacks,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};


export const getAdminSum = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTutors = await Tutor.countDocuments();
    const totalSessions = await EmergencyRequest.countDocuments();

    const revenueData = await Payment.aggregate([
      {
        $match: {
          status: "paid", 
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalTutors,
        totalSessions,
        totalRevenue,
      },
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};