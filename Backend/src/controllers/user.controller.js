import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import User from "../models/user.model.js";
import uploadFile from "../utils/cloudinary.js";

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  // ✅ Corrected field validation
  if (
    [fullName, email, password].some((field) => !field || field.trim() === "")
  ) {
    throw new ApiError("All fields are required", 400);
  }

  // ✅ Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError("User already exists", 400);
  }

  // ✅ Correct file access (assuming multer with upload.fields)
  const avatarLocalPath = req.files?.profileImage?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError("Profile image is required", 400);
  }

  // ✅ Upload image
  const avatar = await uploadFile(avatarLocalPath);
  if (!avatar) {
    throw new ApiError("Failed to upload image", 500);
  }

  // ✅ Create user
  const newUser = await User.create({
    fullName,
    email,
    password,
    profileImage: avatar.url,
  });

  // ✅ Await findById
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError("Failed to create user", 500);
  }

  // ✅ Return success response
  return res.status(201).json(
    new ApiResponse("User created successfully", 201, {
      user: createdUser,
    })
  );
});

export { register };
