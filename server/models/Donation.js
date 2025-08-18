const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Books", "Clothes", "Food", "Blood", "Other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Donated"],
      default: "Available",
    },
    image: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "Address not found",
    },
    location: {
      type: Object,
      default: {},
    },
    // always reference logged-in user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
