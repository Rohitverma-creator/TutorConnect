import Student from "../models/studentModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import uploadOnCloudinary from "../config/cloudinary.js";
import fs from "fs";

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      class: studentClass,
      address,
      gender,
      dob,
      phone,
    } = req.body;

    if (!name || !email || !password || !studentClass) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const existingUser = await Student.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    const uploadResult = await uploadOnCloudinary(req.file.path);

    if (!uploadResult) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }

    const user = await Student.create({
      name,
      email,
      password: hashedPassword,
      class: studentClass,
      image: uploadResult.secure_url,
      address,
      gender,
      dob,
      phone,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      user,
    });
  } catch (error) {
    console.log("Register Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await Student.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.log("Login error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Logout error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Student.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Get user error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const getMyProfile = async (req, res) => {
  try {
    const user = await Student.findById(req.userId).select("-password");

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, address, gender, dob, phone, class: userClass } = req.body;
    const imageFile = req.file;

    const user = await Student.findById(req.userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (gender) user.gender = gender;
    if (dob) user.dob = dob;
    if (userClass) user.class = userClass;

    if (imageFile) {
      const fixedPath = imageFile.path.replace(/\\/g, "/");

      console.log("Uploading:", fixedPath);

      const uploadResult = await uploadOnCloudinary(fixedPath);

      if (uploadResult) {
        console.log("Uploaded URL:", uploadResult.secure_url);
        user.image = uploadResult.secure_url;
      }
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await Student.find().select("-password");

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
