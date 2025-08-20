const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
