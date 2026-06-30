const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

/**
 * @desc    Get all users (with pagination and basic filtering)
 * @route   GET /api/v1/admin/users
 * @access  Private (Admin Only)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
      },
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Toggle account suspension status (Ban/Unban)
 * @route   PATCH /api/v1/admin/users/:id/suspend
 * @access  Private (Admin Only)
 */
exports.toggleUserSuspension = async (req, res) => {
  try {
    const { isSuspended, reason } = req.body;

    if (typeof isSuspended !== "boolean") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please specify true or false for suspension status",
        });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update state
    user.isSuspended = isSuspended;
    await user.save();

    // Determine the logging action state
    const auditAction = isSuspended
      ? "ACCOUNT_SUSPENDED"
      : "ACCOUNT_UNSUSPENDED";

    // Log the security action taken by the Admin
    await AuditLog.create({
      userId: user._id,
      action: auditAction,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      details: `Action taken by Admin (ID: ${req.user._id}). Reason: ${reason || "No reason provided."}`,
    });

    res.status(200).json({
      success: true,
      message: `User account has been successfully ${isSuspended ? "suspended" : "activated"}.`,
      data: { id: user._id, isSuspended: user.isSuspended },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Fetch global security audit trails
 * @route   GET /api/v1/admin/audit-logs
 * @access  Private (Admin Only)
 */
exports.getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const logs = await AuditLog.find()
      .populate("userId", "firstName lastName email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: logs.length,
      page,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
