const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      "LOGIN_SUCCESS",
      "LOGIN_FAILURE",
      "ACCOUNT_LOCKED",
      "EMAIL_VERIFIED",
      "PASSWORD_CHANGED",
      "2FA_ENABLED",
      "2FA_DISABLED",
      "ACCOUNT_SUSPENDED",
      "ACCOUNT_UNSUSPENDED",
    ],
  },
  ipAddress: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    default: "No additional details provided.",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexing for rapid lookup inside administrative logging panels
AuditLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("AuditLog", AuditLogSchema);
