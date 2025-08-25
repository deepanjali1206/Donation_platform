const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    title: { type: String },
    category: { type: String },

    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },

  
    amount: { type: Number },
    transactionId: { type: String }, 

    quantity: { type: Number },
    notes: { type: String },
    image: { type: String, default: "" },

   
    bloodGroup: { type: String },
    date: { type: String },


    donationPlace: { type: String },

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

    paymentMethod: { type: String },
    paymentStatus: {
      type: String,
      enum: ["Unverified", "Verified"],
      default: "Unverified",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
