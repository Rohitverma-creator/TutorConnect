import Tutor from "../models/tutorModel.js";

const updateLastActive = async (req, res, next) => {
  try {
    if (req.user?.id) {
      await Tutor.findByIdAndUpdate(req.user.id, {
        lastActive: new Date(),
      });
    }
    next();
  } catch (err) {
    next();
  }
};

export default updateLastActive;