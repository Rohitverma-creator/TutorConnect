import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "studentImage",
      resource_type: "image",
    });

    // delete local file
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }

    return result;
  } catch (error) {
    if (filePath && fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
    console.log("CLOUDINARY ERROR:", error.message);
    return null;
  }
};

export default uploadOnCloudinary;
