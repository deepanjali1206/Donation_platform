const express = require("express");
const Campaign = require("../models/Campaign");
const router = express.Router();

// ✅ Get all campaigns
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
});

// ✅ Get single campaign by ID
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    res.json(campaign);
  } catch (err) {
    console.error("Error fetching campaign by ID:", err);
    res.status(500).json({ error: "Failed to fetch campaign" });
  }
});

module.exports = router;
