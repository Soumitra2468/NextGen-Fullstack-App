import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
console.log("Cloudinary ENV:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? "Present" : "Missing",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("No file path provided");
    }

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    console.log("File uploaded to Cloudinary:", result.secure_url);

    // ✅ Clean up local file after success
    fs.unlinkSync(filePath);

    // ✅ Return Cloudinary response
    return result.secure_url;
  } catch (error) {
    // ✅ Only try to delete if the file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.error("Error uploading file to Cloudinary:", error);
    throw error;
  }
};

export default uploadFile;
