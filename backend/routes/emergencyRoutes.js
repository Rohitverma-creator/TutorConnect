import express from "express";
import {
  createEmergencyRequest,
  getPendingRequests,
  acceptRequest,
  rejectRequest,
  getRequestStatus,
  completeRequest,
  getTutorSessions,
  getStudentSessions, // ✅ ADD THIS
} from "../controllers/emergencyControllers.js";

import { authTutor } from "../middlewares/authTutor.js";
import { authUser } from "../middlewares/auth.js";

const emergencyRouter = express.Router();

emergencyRouter.post("/create", authUser, createEmergencyRequest);

emergencyRouter.get("/pending", authTutor, getPendingRequests);

emergencyRouter.post("/accept", authTutor, acceptRequest);

emergencyRouter.post("/reject", authTutor, rejectRequest);

emergencyRouter.get("/status/:requestId", authUser, getRequestStatus);

emergencyRouter.post("/complete", authTutor, completeRequest);

emergencyRouter.get("/tutor-sessions", authTutor, getTutorSessions);

emergencyRouter.get("/student-sessions", authUser, getStudentSessions);

export default emergencyRouter;