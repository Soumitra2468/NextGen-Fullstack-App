import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}`);
    process.on("error", (err) => {
      console.log("Error connecting to MongoDB:", err);
      throw err;
    });
    console.log(`✅ MongoDB connected: ${conn?.connection?.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Exit process on failure
  }
};

export default connectDB;
