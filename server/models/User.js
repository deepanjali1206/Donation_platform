const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "ngo", "admin"], default: "user" },

    // Credits system
    credits: { type: Number, default: 0 },
    pendingCredits: { type: Number, default: 0 },
    creditHistory: [
      {
        type: { type: String, enum: ["earn", "spend"], required: true },
        amount: { type: Number, required: true },
        reason: { type: String, default: "" },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Export the model
const User = mongoose.model("User", userSchema);
module.exports = User;
