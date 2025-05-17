import dotenv from "dotenv";
import connectDB from "./db/dbConnection.js";
import app from "./app.js";

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.on("error", (err) => {
      console.error("Server error:", err);
      throw err;
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
