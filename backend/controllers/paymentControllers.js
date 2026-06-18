import Payment from "../models/paymentModel.js";
import EmergencyRequest from "../models/emergencyModel.js";
import razorpay from "../config/razorpay.js";   
import crypto from "crypto";                  

export const createOrder = async (req, res) => {
  try {
    const { type, requestId, amount } = req.body;

    let finalAmount;
    let tutorId = null;

    if (type === "emergency") {
      const request = await EmergencyRequest.findById(requestId);

      if (!request) {
        return res.json({ success: false, message: "Request not found" });
      }

      finalAmount = request.fee;
      tutorId = request.tutor;
    }

    else if (type === "booking") {
      if (!amount) {
        return res.json({ success: false, message: "Amount required" });
      }

      finalAmount = amount;
    }

    else {
      return res.json({ success: false, message: "Invalid type" });
    }

    const order = await razorpay.orders.create({
      amount: finalAmount * 100,
      currency: "INR",
      receipt: requestId || "booking_payment",
    });

    const payment = await Payment.create({
      student: req.userId,
      tutor: tutorId,
      request: requestId || null,
      amount: finalAmount,
      razorpayOrderId: order.id,
    });

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ success: false });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      type,
      requestId,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.json({ success: false, message: "Invalid signature" });
    }

    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: "paid",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date(),
      }
    );

  
    if (type === "emergency" && requestId) {
      const request = await EmergencyRequest.findById(requestId);

      if (!request) {
        return res.json({ success: false, message: "Request not found" });
      }

      await EmergencyRequest.findByIdAndUpdate(requestId, {
        paymentStatus: "paid",
      });

      return res.json({
        success: true,
        meetingLink: request.meetingLink,
      });
    }

  
    res.json({ success: true });

  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ success: false });
  }
};