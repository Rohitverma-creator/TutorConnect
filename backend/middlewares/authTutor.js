import jwt from "jsonwebtoken";

export const authTutor = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.json({ success: false, message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "tutor") {
      return res.json({ success: false, message: "Access denied" });
    }

    req.userId = decoded.id; 
    req.user = decoded;

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};