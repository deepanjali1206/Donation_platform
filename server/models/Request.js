
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

    attachment: { type: String },

  
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Request || mongoose.model("Request", requestSchema);
