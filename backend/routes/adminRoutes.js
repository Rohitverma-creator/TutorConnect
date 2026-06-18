import express from "express";
import {
  adminLogin,
  getAdminStats,
  getAllSessions,
  getAllPayments,
  getAllStudents,
  getAllTutors,
  adminLogout,
  getAllFeedbacks
} from "../controllers/adminControllers.js";

import { authAdmin } from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/logout", authAdmin, adminLogout);
adminRouter.get("/stats", authAdmin, getAdminStats);
adminRouter.get("/sessions", authAdmin, getAllSessions);
adminRouter.get("/payments", authAdmin, getAllPayments);
adminRouter.get("/students", authAdmin, getAllStudents);
adminRouter.get("/tutors", authAdmin, getAllTutors);
adminRouter.get("/feedbacks",authAdmin,getAllFeedbacks);

export default adminRouter;