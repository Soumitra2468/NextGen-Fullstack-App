import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      index: true,
    },
    profileImage: {
      type: String,
      default:
        "https://res.cloudinary.com/dqj8xg3zv/image/upload/v1698231234/DefaultProfileImage.png",
      required: [true, "Profile image is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: [true, "Email must be lowercase"],
      trim: [true, "Email must be trimmed"],
      unique: [true, "Email already exists"],
      index: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods = {
  comparePassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
  genAccessToken: function () {
    return jwt.sign(
      { id: this._id, fullName: this.fullName, email: this.email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN || "1d",
      }
    );
  },
  genRefreshToken: function () {
    return jwt.sign(
      { id: this._id, fullName: this.fullName, email: this.email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN || "30d",
      }
    );
  },
};

const User = mongoose.model("User", userSchema);
export default User;
