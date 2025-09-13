const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth"); // assuming you have auth

// GET /api/user/credits
router.get("/credits", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Calculate total earned, pending, spent, balance
    const earned = user.creditHistory
      .filter((h) => h.type === "earn" && h.status === "earned")
      .reduce((sum, h) => sum + h.amount, 0);

    const pending = user.creditHistory
      .filter((h) => h.status === "pending")
      .reduce((sum, h) => sum + h.amount, 0);

    const spent = user.creditHistory
      .filter((h) => h.type === "spend")
      .reduce((sum, h) => sum + h.amount, 0);

    const balance = earned + user.pendingCredits - spent;

    // Determine level
    let level = "Bronze";
    if (balance >= 1001) level = "Diamond";
    else if (balance >= 601) level = "Platinum";
    else if (balance >= 301) level = "Gold";
    else if (balance >= 101) level = "Silver";

    res.json({
      earned,
      pending,
      spent,
      balance,
      level,
      history: user.creditHistory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/user/top-donors
router.get("/top-donors", async (req, res) => {
  try {
    const topDonors = await User.find({})
      .sort({ credits: -1 })
      .limit(10)
      .select("name credits");

    res.json(topDonors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
