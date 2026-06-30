const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  image: { type: String, default: "" },
});

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  items: [OrderItemSchema],
  totalPaid: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["Placed", "Processing", "Shipped", "Delivered", "Canceled"],
    default: "Placed",
  },
  customerName: String,
  phone: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
