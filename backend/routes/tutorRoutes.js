import express from "express";
import multer from "multer";

import {
  addTutor,
  loginTutor,
  getPendingTutors,
  updateTutorStatus,
  getCurrentTutor,
  getApprovedTutors,
  toggleAvailability,
  logoutTutor,
  getTutorStats,
  getTutorEarnings,
  getRecommendedTutors
} from "../controllers/tutorController.js";
import { authTutor } from "../middlewares/authTutor.js";
import updateLastActive from "../middlewares/updateLastActive.js";

const tutorRouter = express.Router();

const upload = multer({
  dest: "public",
});

tutorRouter.post("/register", upload.single("image"), addTutor);
tutorRouter.post("/login", loginTutor);
tutorRouter.get("/get-current-tutor", authTutor, getCurrentTutor);
tutorRouter.get("/approved-tutors", getApprovedTutors);
tutorRouter.get("/pending", getPendingTutors);
tutorRouter.put("/status/:id", updateTutorStatus);
tutorRouter.get("/logout", authTutor, logoutTutor);

tutorRouter.get("/profile", authTutor, updateLastActive, getCurrentTutor);
tutorRouter.post(
  "/toggle-availability",
  authTutor,
  toggleAvailability
);
tutorRouter.get("/stats",authTutor,getTutorStats);
tutorRouter.get("/earnings", authTutor, getTutorEarnings);
tutorRouter.post("/recommended-tutors", getRecommendedTutors);

export default tutorRouter;
