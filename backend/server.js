import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongoDB.js";
import connectCloudinary from "./config/cloudinary.js";

import tutorRouter from "./routes/tutorRoutes.js";
import studentRouter from "./routes/studentRoutes.js";
import interviewRouter from "./routes/interviewRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import emergencyRouter from "./routes/emergencyRoutes.js";
import feedBackRouter from "./routes/feedBackRoutes.js";
import timeTableModel from "./models/timeTableModel.js";
import timeTableRouter from "./routes/timeTableRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import adminModel from "./models/adminModel.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

connectDB();
connectCloudinary();

// APIS
app.use("/api/tutor", tutorRouter);
app.use("/api/student", studentRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/emergency", emergencyRouter);
app.use("/api/feedback", feedBackRouter);
app.use("/api/timetable",timeTableRouter)
app.use("/api/payment", paymentRouter);
app.use("/api/admin",adminRouter)


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
