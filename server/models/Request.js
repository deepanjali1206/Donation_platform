const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  item: { type: String, required: true },
  urgency: { type: String, required: true },
  quantity: { type: Number, required: true },
  coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
  isNGO: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Request = mongoose.models.Request || mongoose.model("Request", requestSchema);

module.exports = Request;
