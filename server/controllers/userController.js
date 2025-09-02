// controllers/userController.js
const User = require("../models/User");
const Donation = require("../models/Donation");

/**
 * Get all users (admin)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

/**
 * Get credits info for logged-in user:
 * - earned: user.credits
 * - pending: user.pendingCredits
 * - history: user's creditHistory (spends/earned finalized) + pending donations
 */
const getCredits = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.id).select("credits pendingCredits creditHistory");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch pending donations for this user (to display pending in history)
    const pendingDonations = await Donation.find({
      user: req.user.id,
      status: { $in: ["Pending", "Processing"] },
    })
      .sort({ createdAt: -1 })
      .select("title credits donationType createdAt");

    const pendingEntries = (pendingDonations || []).map((d) => ({
      type: "pending",
      amount: d.credits || 0,
      reason: `Donation pending: ${d.title || d.donationType || "donation"}`,
      date: d.createdAt,
    }));

    // Use stored creditHistory for finalized earn/spend records
    const finalizedHistory = (user.creditHistory || []).map((h) => ({
      type: h.type,
      amount: h.amount,
      reason: h.reason,
      date: h.date,
    }));

    // Put pending entries first (most recent) OR combine as you prefer
    const history = [...finalizedHistory, ...pendingEntries];

    res.json({
      earned: user.credits || 0,
      pending: user.pendingCredits || 0,
      history,
    });
  } catch (err) {
    console.error("getCredits error:", err);
    res.status(500).json({ message: "Error fetching credits", error: err.message });
  }
};

module.exports = { getAllUsers, getCredits };
