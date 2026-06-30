const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  toggleUserSuspension,
  getAuditLogs,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Secure all routes below this line—Requires a valid session AND admin permissions
router.use(protect);
router.use(authorize("admin"));

// Admin Management Endpoints
router.get("/users", getAllUsers);
router.patch("/users/:id/suspend", toggleUserSuspension);
router.get("/audit-logs", getAuditLogs);

module.exports = router;
