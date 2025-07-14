const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  item: String,
  urgency: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
  quantity: Number,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number], // [longitude, latitude]
  },
  isNGO: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["Active", "Fulfilled", "Cancelled"],
    default: "Active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

requestSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Request", requestSchema);
