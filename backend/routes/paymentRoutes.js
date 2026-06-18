import express from "express";
import { authUser } from "../middlewares/auth.js";
import {
  createOrder,
  verifyPayment,
} from "../controllers/paymentControllers.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", authUser, createOrder);
paymentRouter.post("/verify-payment", authUser, verifyPayment);

export default paymentRouter;
