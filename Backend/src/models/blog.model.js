import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
  {
    titel: {
      type: String,
      required: [true, "Title is required"],
    },
    coverImage: {
      type: String,
      default:
        "https://res.cloudinary.com/dqj8xg3zv/image/upload/v1698231234/DefaultProfileImage.png",
      required: [true, "Cover image is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
