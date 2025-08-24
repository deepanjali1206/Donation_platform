const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    // Required by your frontend
    title: { type: String, required: true },
    category: { type: String, required: true }, // "money" | "item" | "blood"
    requesterName: { type: String, required: true },
    requesterEmail: { type: String, required: true },

    // Item-specific
    item: { type: String },
    urgency: { type: String },
    quantity: { type: Number },

    // Money-specific
    amount: { type: Number },
    notes: { type: String },

    // Blood-specific
    bloodGroup: { type: String },
    date: { type: String }, // date as string (frontend sends plain)
    location: { type: String },

    // General
    isNGO: { type: Boolean, default: false },
    coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]

    // User link (from token)
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Request =
  mongoose.models.Request || mongoose.model("Request", requestSchema);

module.exports = Request;
