import { V2 as cloudinary } from "cloudinary";
import fs from "fs";

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
  } catch (error) {
    fs.unlinkSync(filePath); // Delete the file if upload fails
    console.error("Error uploading file to Cloudinary:", error);
    throw error;
  }
};

export default uploadFile;
