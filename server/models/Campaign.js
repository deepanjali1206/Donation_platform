
const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  title: String,
  description: String,
  goalAmount: Number,
  raisedAmount: Number,
  image: String,
  type: { type: String, enum: ["money", "items", "blood"], default: "money" }
});

module.exports = mongoose.model("Campaign", CampaignSchema);
