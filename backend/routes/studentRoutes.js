import express from "express";
import multer from "multer";

import {
  registerUser,
  loginUser,
  logoutUser,
  getUserById,
  getMyProfile,
  getAllUsers,
  updateUserProfile,
} from "../controllers/studentController.js";

import { authUser } from "../middlewares/auth.js";

const studentRouter = express.Router();
const upload = multer({ dest: "public/" });

studentRouter.post("/register", upload.single("image"), registerUser);
studentRouter.post("/login", loginUser);
studentRouter.post("/logout", authUser, logoutUser);

studentRouter.get("/me", authUser, getMyProfile);
studentRouter.get("/all", getAllUsers);

studentRouter.put("/update", authUser, upload.single("image"),updateUserProfile)

studentRouter.get("/user/:id", getUserById);

export default studentRouter;
