const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protects routes by validating the incoming JWT access token.
 * Dynamically handles token expiration and attaches the verified user to the request object.
 */
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized to access this route" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database and attach to request (excluding password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(404)
        .json({
          success: false,
          message: "User matching this token no longer exists",
        });
    }

    // Check if account is suspended or banned
    if (req.user.isSuspended) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Your account has been suspended. Please contact support.",
        });
    }

    next();
  } catch (error) {
    console.error(`🔒 Auth Middleware Error: ${error.message}`);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({
          success: false,
          message: "Token expired",
          code: "TOKEN_EXPIRED",
        });
    }

    return res
      .status(401)
      .json({
        success: false,
        message: "Not authorized, token validation failed",
      });
  }
};

/**
 * Restricts access to specific roles.
 * Must be used AFTER the 'protect' middleware.
 *
 * @param  {...string} roles - Permitted roles (e.g., 'admin', 'moderator')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role (${req.user?.role || "guest"}) is not authorized to access this resource`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
