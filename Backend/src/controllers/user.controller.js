import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import User from "../models/user.model.js";
import uploadFile from "../utils/cloudinary.js";

const genAccRefToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.genAccessToken();
    const refreshToken = user.genRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      "Somthing went wrong when generating refresh and access token",
      500
    );
  }
};

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

const logn = asyncHandler(async (req, res) => {
  const { email, fullName, password } = req.body;
  if (!email) {
    throw new ApiError("email is required", 404);
  }
  const user = User.findOne({ email });
  if (!user) {
    throw new ApiError("User does not exsits", 400);
  }
  const passwordValid = await user.comparePassword(password);

  if (!passwordValid) {
    throw new ApiError("Wrong password please try again", 401);
  }

  const { accessToken, refreshToken } = await genAccRefToken(user._id);

  const userData = await User.findById(user._id).select(
    "-password -refreshToken "
  );

  if (!userData) {
    throw new ApiError("Error, fetching user data", 500);
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user: userData,
        refreshToken,
        accessToken,
      })
    );
});

const logout = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfully", {}));
});

export { register, logn, logout };
