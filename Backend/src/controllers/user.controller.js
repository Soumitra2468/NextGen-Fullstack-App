import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import User from "../models/user.model.js";
import uploadFile from "../utils/cloudinary.js";

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  if (
    [fullName, email, password].some((field) => {
      field.trim() === "" || field === undefined || field === null;
    })
  ) {
    throw new ApiError("All fields are required", 400);
  }
  const user = User.findOne({ email });
  if (user) {
    throw new ApiError("User already exists", 400);
  }
  const avtarLocalPath = req.file?.profileImage[0].path;
  if (!avtarLocalPath) {
    throw new ApiError("Profile image is required", 400);
  }

  const avtar = await uploadFile(avtarLocalPath);
  if (!avtar) {
    throw new ApiError("Failed to upload image", 500);
  }
  const newUser = await User.create({
    fullName,
    email,
    password,
    profileImage: avtar.url,
  });

  const cretedUser = User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!cretedUser) {
    throw new ApiError("Failed to create user", 500);
  }

  return res.status(201).json(
    new ApiResponse("User created successfully", 201, {
      user: cretedUser,
    })
  );
});

export { register };
