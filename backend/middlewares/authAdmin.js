import jwt from "jsonwebtoken";

export const authAdmin = (req, res, next) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return res.json({ success: false, message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.json({ success: false, message: "Not authorized" });
    }

    req.adminId = decoded.adminId;

    next();
  } catch (error) {
    console.log("ERROR:", error.message);
    res.json({ success: false, message: "Invalid token" });
  }
};