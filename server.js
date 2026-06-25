import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Hardcoded Local MongoDB Connection Test
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/merkato_store";

console.log("⏳ Attempting to connect to MongoDB...");

mongoose
  .connect(MONGO_URI)
  .then((conn) => {
    console.log(
      `🍃 MongoDB Connected Successfully to: ${conn.connection.host}`,
    );
  })
  .catch((error) => {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
  });

// 2. Simple Route
app.get("/", (req, res) => {
  res.send("Server is alive!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
