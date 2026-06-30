const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");

router.route("/").post(protect, createOrder).get(getOrders);
router.route("/:id").get(getOrder).patch(protect, updateOrderStatus).delete(protect, deleteOrder);

module.exports = router;
