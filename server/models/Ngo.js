const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  documents: [
    {
      filename: String,
      originalName: String,
      path: String,
      uploadedAt: { type: Date, default: Date.now },
      status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" }
    }
  ],
  status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.NGO || mongoose.model("NGO", ngoSchema);
