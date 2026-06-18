import express from "express";
import {
  createFeedback,
  getTutorFeedback,
  getAverageRating,
} from "../controllers/feedbackController.js";
import {authUser} from "../middlewares/auth.js";

const feedBackRouter = express.Router();

feedBackRouter.post("/create", authUser, createFeedback);
feedBackRouter.get("/tutor/:tutorId", getTutorFeedback);
feedBackRouter.get("/rating/:tutorId", getAverageRating);

export default feedBackRouter;