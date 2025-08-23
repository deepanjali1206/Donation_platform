// server/models/Donation.js
const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    image: { type: String, default: "" }, // store filename only
    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
