const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const path = require("path");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// 1. Global Security Middlewares
// Helmet sets secure HTTP headers to defend against XSS and clickjacking
app.use(helmet());

// Dynamic CORS configuration allowing access ONLY from your Vite frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // Allows HTTP-only cookies/tokens to be sent across origins
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 2. Body Parsers
app.use(express.json({ limit: "10kb" })); // Restricts payloads to prevent DOS attacks
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Expose the temporary uploads directory statically to serve profile avatars safely
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// 3. API Route Registration
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);

// 4. Global 404 Fallback Handlers
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found - Cannot execution action on ${req.originalUrl}`,
  });
});

// 5. Global Error Isolation Middleware
app.use((err, req, res, next) => {
  console.error(`💥 Runtime Application Exception: ${err.stack}`);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message || "Internal Server Error. Security pipeline isolated.",
    // Only expose full trace in development mode
    error: process.env.NODE_ENV === "development" ? err.stack : {},
  });
});

module.exports = app;
