import Booking from "../models/bookingModel.js";
import User from "../models/studentModel.js";
import Tutor from "../models/tutorModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";

// --- CREATE BOOKING ---
export const createBooking = async (req, res) => {
  try {
    const { tutor, startTime, meetingLink, price, problemText } = req.body;

    const student = req.userId;

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!tutor || !startTime || !price || !problemText) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const start = new Date(startTime);

    if (isNaN(start.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start time",
      });
    }

    if (start.getMinutes() !== 0) {
      return res.status(400).json({
        success: false,
        message: "Only full-hour slots allowed",
      });
    }

    const cleanDate = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );

    const formattedStart = `${String(start.getHours()).padStart(2, "0")}:${String(
      start.getMinutes()
    ).padStart(2, "0")}`;

    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    const formattedEnd = `${String(end.getHours()).padStart(2, "0")}:${String(
      end.getMinutes()
    ).padStart(2, "0")}`;

    const existingBooking = await Booking.findOne({
      tutor,
      date: cleanDate,
      startTime: formattedStart,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: "Time slot already booked",
      });
    }

    let problemImage = "";

    if (req.file) {
      const upload = await uploadOnCloudinary(req.file.path);
      problemImage = upload?.secure_url || "";
    }

    const booking = await Booking.create({
      student,
      tutor,
      date: cleanDate,
      startTime: formattedStart,
      endTime: formattedEnd,
      duration: 60,
      meetingLink,
      price,
      problemText,
      problemImage,
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// --- GET TUTOR BOOKINGS  ---
export const getTutorBookings = async (req, res) => {
  try {
    const tutorId = req.user?._id || req.user?.id;

    if (!tutorId || req.user.role !== "tutor") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const bookings = await Booking.find({
      tutor: tutorId,
      isDeleted: false,
    })
      .populate("student", "name email image profilePic")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Booking.countDocuments({
      tutor: tutorId,
      isDeleted: false,
    });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      bookings,
    });
  } catch (error) {
    console.error("Get Tutor Bookings Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --- UPDATE STATUS ---

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status, meetingLink } = req.body;

    if (status === "confirm") status = "confirmed";
    if (status === "accept") status = "confirmed";

    const validStatuses = [
      "pending",
      "confirmed",
      "cancelled",
      "completed",
      "rejected",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    console.log("Updating Booking:", id, "to status:", status);

    const updateData = {
      status,
    };

    if (meetingLink) {
      updateData.meetingLink = meetingLink;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("student tutor");

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// --- CANCEL BOOKING ---
export const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user?._id || req.user?.id;

    const booking = await Booking.findById(bookingId);
    if (!booking)
      return res.status(404).json({ success: false, message: "Not found" });

    if (
      booking.student.toString() !== userId.toString() &&
      booking.tutor.toString() !== userId.toString()
    ) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    booking.status = "cancelled";
    booking.cancelledBy =
      booking.student.toString() === userId.toString() ? "student" : "tutor";

    await booking.save();
    return res
      .status(200)
      .json({ success: true, message: "Cancelled successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --- GET STUDENT BOOKINGS ---
export const getStudentBookings = async (req, res) => {
  try {
    const studentId = req.userId;

    const bookings = await Booking.find({
      student: studentId,
      isDeleted: false,
    })
      .populate("tutor", "name email image")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "tutor student",
    );

    if (!booking) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const markAsCompleted = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    const tutorId = req.user?._id || req.user?.id;

    if (!booking || booking.tutor.toString() !== tutorId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (booking.status === "completed") {
      return res.status(400).json({ success: false, message: "Already marked as completed" });
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({ success: false, message: "Only confirmed bookings can be completed" });
    }

    const now = new Date();
    const sessionStart = new Date(booking.date);
    const [h, m] = booking.startTime.split(":");
    sessionStart.setHours(parseInt(h), parseInt(m), 0, 0);

    const duration = booking.duration || 60;
    const sessionEnd = new Date(sessionStart);
    sessionEnd.setMinutes(sessionEnd.getMinutes() + duration);
    sessionEnd.setMinutes(sessionEnd.getMinutes() + 30);

    if (now < sessionEnd) {
      return res.status(400).json({
        success: false,
        message: "You can mark completed only after session + 30 mins",
      });
    }

    booking.status = "completed";
    await booking.save();

    await tutorModel.findByIdAndUpdate(tutorId, {
      $inc: { 
        sessions: 1,           
        students: 1,           
        earnings: booking.amount || 0 
      }
    });

    return res.status(200).json({
      success: true,
      message: "Session marked as completed and Tutor stats updated",
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const uploadTutorProof = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image required",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const cloudinaryRes = await uploadOnCloudinary(req.file.path);

    if (!cloudinaryRes) {
      return res.status(500).json({
        success: false,
        message: "Upload failed",
      });
    }

    booking.tutorProofImage = cloudinaryRes.secure_url;
    booking.isTutorUploaded = true;

    await booking.save();

    return res.json({
      success: true,
      message: "Tutor proof uploaded",
      booking,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadStudentProof = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image required",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const cloudinaryRes = await uploadOnCloudinary(req.file.path);

    if (!cloudinaryRes) {
      return res.status(500).json({
        success: false,
        message: "Upload failed",
      });
    }

    booking.studentProofImage = cloudinaryRes.secure_url;
    booking.isStudentUploaded = true;

    await booking.save();

    return res.json({
      success: true,
      message: "Student proof uploaded",
      booking,
    });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

export const verifyProof = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    if (!booking.isTutorUploaded || !booking.isStudentUploaded) {
      return res.status(400).json({
        success: false,
        message: "Both proofs not uploaded",
      });
    }

    booking.proofVerified = true;
    booking.status = "completed";

    await booking.save();

    return res.json({
      success: true,
      message: "Session verified & completed",
      booking,
    });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

export const rejectProof = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false });
    }

    booking.tutorProofImage = null;
    booking.studentProofImage = null;
    booking.isTutorUploaded = false;
    booking.isStudentUploaded = false;
    booking.proofVerified = false;

    await booking.save();

    return res.json({
      success: true,
      message: "Proof rejected, re-upload required",
    });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};
