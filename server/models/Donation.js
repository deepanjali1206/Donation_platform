const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },

    category: { type: String, trim: true },

    donorName: { type: String, required: true, trim: true },

    donorEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },

    // For money donations
    amount: { type: Number, min: 0 },
    transactionId: { type: String, trim: true },

    // For item donations
    quantity: { type: Number, min: 1 },
    notes: { type: String, trim: true },
    image: { type: String, default: "" },

    // For blood donations
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    date: { type: Date },

    // ✅ Location is plain string, not GeoJSON
    location: { type: String, trim: true },

    donationType: {
      type: String,
      enum: ["money", "item", "blood"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered"],
      default: "Pending",
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "NetBanking", "Razorpay", null],
      default: null,
    },

    paymentStatus: {
      type: String,
      enum: ["Unverified", "Verified"],
      default: "Unverified",
    },
  },
  { timestamps: true }
);

const Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation;
