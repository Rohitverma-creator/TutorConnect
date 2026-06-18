import express from "express";
import multer from "multer";

import {
  createBooking,
  getStudentBookings,
  getTutorBookings,
  updateBookingStatus,
  cancelBooking,
  uploadTutorProof,
  uploadStudentProof,
  verifyProof,
  rejectProof,
  getBookingById,
} from "../controllers/bookingControllers.js";

import { authUser } from "../middlewares/auth.js";
import { authTutor } from "../middlewares/authTutor.js";

const bookingRouter = express.Router();

const upload = multer({ dest: "public/" });

bookingRouter.post("/create-booking", authUser, upload.single("image"), createBooking);
bookingRouter.get("/student", authUser, getStudentBookings);
bookingRouter.patch("/:id/cancel", authUser, cancelBooking);

bookingRouter.get("/tutor", authTutor, getTutorBookings);
bookingRouter.patch("/:id/status", authTutor, updateBookingStatus);
bookingRouter.patch("/:id/tutor-cancel", authTutor, cancelBooking);

bookingRouter.get("/:id", authUser, getBookingById);

bookingRouter.post(
  "/:id/tutor-proof",
  authTutor,
  upload.single("image"),
  uploadTutorProof,
);
bookingRouter.post(
  "/:id/student-proof",
  authUser,
  upload.single("image"),
  uploadStudentProof,
);

//bookingRouter.patch("/:id/verify-proof", authUser, isAdmin, verifyProof);
//bookingRouter.patch("/:id/reject-proof", authUser, isAdmin, rejectProof);

export default bookingRouter;
