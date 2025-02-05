// db/connect.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "coingame", // Explicitly set the database name
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // Propagate the error to handle it in your server setup
  }
};
