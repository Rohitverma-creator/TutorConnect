import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
  try {


    const token = req.cookies.token;

    if (!token) {
      return res.json({ success: false, message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();
  } catch (error) {
    console.log("ERROR:", error.message);
    res.json({ success: false, message: "Invalid token" });
  }
};
