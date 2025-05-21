import User from "../models/user.model";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError("Access token is required", 401);
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = User.findById(decodedToken?.id).select(
      "-password -refreshToken -__v -createdAt -updatedAt"
    );

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError("Invalid access token", 401);
  }
});
