const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "Donor", "ngo", "admin"], // ✅ all allowed roles
      default: "user",
    },

    // ✅ Credits system
    credits: {
      type: Number,
      default: 0,
    },
    pendingCredits: {
      type: Number,
      default: 0,
    },
    creditHistory: [
      {
        type: {
          type: String,
          enum: ["earn", "spend"], // ✅ allowed transaction types
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: [0, "Amount must be positive"],
        },
        reason: {
          type: String,
          default: "",
          trim: true,
        },
        status: {
          type: String,
          enum: ["pending", "earned"], // ✅ allow status
          default: "pending",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
