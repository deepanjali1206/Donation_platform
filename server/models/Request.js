const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },

    requesterName: { type: String, required: true },
    requesterEmail: { type: String, required: true },
    requesterPhone: { type: String, required: true },

    item: { type: String },
    urgency: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    quantity: { type: Number },

    amount: { type: Number },
    notes: { type: String },

    bloodGroup: { type: String },
    date: { type: String },

    location: { type: String, required: true },

    coordinates: {
      type: [Number],
      validate: {
        validator: (arr) => !arr || arr.length === 2,
        message: "coordinates must be [lon, lat]",
      },
    },

    isNGO: { type: Boolean, default: false },
    isChild: { type: Boolean, default: false },   // ✅ Free request case
    isElderly: { type: Boolean, default: false }, // ✅ Free request case
    isEmergency: { type: Boolean, default: false }, // ✅ Free request case

    attachment: { type: String },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // ✅ Credit system fields
    creditsRequired: { type: Number, default: 0 }, // how many credits needed for this request
    creditsUsed: { type: Number, default: 0 },     // how many credits actually deducted
    isFreeRequest: { type: Boolean, default: false }, // auto-true if NGO/child/elderly/emergency
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Request || mongoose.model("Request", requestSchema);
