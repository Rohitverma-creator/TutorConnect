import express from "express";
import { 
  generateTimetable, 
  getMyTimetables 
} from "../controllers/timetableControllers.js";
import { authUser } from "../middlewares/auth.js";

const timeTableRouter = express.Router();



timeTableRouter.post("/generate",authUser, generateTimetable);
timeTableRouter.get("/my-records",authUser, getMyTimetables);

export default timeTableRouter;