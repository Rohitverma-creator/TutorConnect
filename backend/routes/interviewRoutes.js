import express from "express";

import {
  generateInterview,
  submitInterview,
  getMyInterviews,
} from "../controllers/interviewController.js";

import { authTutor } from "../middlewares/authTutor.js";

const interviewRouter = express.Router();

interviewRouter.get("/generate", authTutor, generateInterview);

interviewRouter.post("/submit", authTutor, submitInterview);

interviewRouter.get("/my", authTutor, getMyInterviews);

export default interviewRouter;
