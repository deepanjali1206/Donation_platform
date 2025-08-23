const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },

    // Money donation
    amount: { type: Number },

    // Item donation
    quantity: { type: Number },
    notes: { type: String },

    donationType: {
      type: String,
      enum: ["money", "item"],
      required: true,
    },

    image: { type: String, default: "" }, // filename
    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
