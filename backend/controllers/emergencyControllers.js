import EmergencyRequest from "../models/emergencyModel.js";
import Tutor from "../models/tutorModel.js";
import Booking from "../models/bookingModel.js";

export const createEmergencyRequest = async (req, res) => {
  try {
    const { subject, problemText, duration = 30 } = req.body;

    const cleanSubject = subject?.trim();

    if (!cleanSubject || !problemText) {
      return res.status(400).json({
        success: false,
        message: "Subject and problem are required",
      });
    }

    if (duration <= 0 || duration > 120) {
      return res.status(400).json({
        success: false,
        message: "Invalid duration",
      });
    }

    const existingRequest = await EmergencyRequest.findOne({
      student: req.userId,
      status: "pending",
      requestExpiresAt: { $gte: new Date() }, 
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have an active request",
      });
    }

    const tutors = await Tutor.find({
      subject: { $regex: cleanSubject, $options: "i" },
      isBusy: false,
      status: "approved",
      available: true,
    }).select("_id");

    if (tutors.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No tutors available right now",
      });
    }

    const fee = Math.ceil(duration / 30) * 50;

    const requestData = {
      student: req.userId,
      subject: cleanSubject,
      problemText,
      duration,
      fee,
      requestExpiresAt: new Date(Date.now() + 2 * 60 * 1000),
      notifiedTutors: tutors.map((t) => t._id),
    };

    const request = await EmergencyRequest.create(requestData);

    res.json({
      success: true,
      message: "Request sent to tutors",
      requestId: request._id,
      fee,
      duration,
    });
  } catch (err) {
    console.error("ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const getPendingRequests = async (req, res) => {
  try {
    const tutorId = req.userId;

    const requests = await EmergencyRequest.find({
      status: "pending",
      notifiedTutors: tutorId,
    })
      .populate("student")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
export const acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const tutorId = req.userId;

    const tutor = await Tutor.findOne({
      _id: tutorId,
      isBusy: false,
      available: true,
      status: "approved",
    });

    if (!tutor) {
      return res.json({
        success: false,
        message: "Tutor not available",
      });
    }

    const roomId = `room_${requestId}`;
    const meetingLink = `https://meet.jit.si/${roomId}`;

    const request = await EmergencyRequest.findOneAndUpdate(
      {
        _id: requestId,
        status: "pending",
      },
      {
        status: "accepted",
        tutor: tutorId,
        meetingLink,
        requestExpiresAt: null,
      },
      { new: true }
    );

    if (!request) {
      return res.json({
        success: false,
        message: "Already taken or expired",
      });
    }

    tutor.isBusy = true;
    tutor.currentRequest = requestId;
    await tutor.save();

    res.json({
      success: true,
      requestId: request._id,
      fee: request.fee,
      message: "Payment required to start session",
    });

  } catch (err) {
    console.log("ACCEPT ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await EmergencyRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.json({
      success: true,
      status: request.status,
      meetingLink: request.meetingLink,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const completeRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const tutorId = req.userId;

    const request = await EmergencyRequest.findOne({
      _id: requestId,
      tutor: tutorId,
    });

    if (!request) {
      return res.json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.status !== "accepted") {
      return res.json({
        success: false,
        message: "Session not active",
      });
    }

    request.status = "completed";
    request.isCompleted = true;
    request.completedAt = new Date();
    request.requestExpiresAt = null;

    await request.save();

    const tutor = await Tutor.findById(tutorId);

    if (tutor) {
      tutor.isBusy = false;
      tutor.available = true;
      tutor.currentRequest = null;

      await tutor.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const getTutorSessions = async (req, res) => {
  try {
    const tutorId = req.userId;

    const active = await EmergencyRequest.findOne({
      tutor: tutorId,
      status: "accepted",
    }).populate("student");

    const history = await EmergencyRequest.find({
      tutor: tutorId,
      status: { $in: ["accepted", "completed"] }, 
    })
      .populate("student")
      .sort({ createdAt: -1 }); 

    res.json({
      success: true,
      active,
      history,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const tutorId = req.userId;

    const request = await EmergencyRequest.findOneAndUpdate(
      {
        _id: requestId,
        status: "pending",
        requestExpiresAt: { $gte: new Date() },
        notifiedTutors: tutorId,
      },
      {
        $addToSet: { rejectedBy: tutorId },
        $pull: { notifiedTutors: tutorId },
      },
      { new: true },
    );

    if (!request) {
      return res.json({
        success: false,
        message: "Request not available",
      });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const expireRequests = async () => {
  try {
   await EmergencyRequest.updateMany(
  {
    status: "pending",
    requestExpiresAt: { $lt: new Date() }, 
  },
  {
    $set: { status: "expired" },
    $unset: {
      notifiedTutors: "",
    },
  }
);
  } catch (err) {
    console.log("Expire Error:", err.message);
  }
};
export const getStudentSessions = async (req, res) => {
  try {
    const studentId = req.userId;

    const sessions = await EmergencyRequest.find({
      student: studentId,
      status: { $in: ["accepted", "completed"] },
    })
      .populate("tutor", "name email")
      .sort({ createdAt: -1 }); 

    res.json({
      success: true,
      sessions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};