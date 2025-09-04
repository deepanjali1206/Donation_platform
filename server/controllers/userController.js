// controllers/userController.js
const User = require("../models/User");
const Donation = require("../models/Donation");

/**
 * Get all users (admin only)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};

/**
 * Get credits info for logged-in user:
 * - earned: user.credits
 * - pending: user.pendingCredits
 * - history: finalized creditHistory + pending donations
 */
const getCredits = async (req, res) => {
  try {
    console.log("🟢 getCredits called for user:", req.user.id);
    
    if (!req.user?.id)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.id).select(
      "credits pendingCredits creditHistory"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("📊 User credits data from DB:", {
      credits: user.credits,
      pendingCredits: user.pendingCredits,
      creditHistoryLength: user.creditHistory?.length || 0
    });

    // ✅ Fetch pending donations (not yet approved)
    const pendingDonations = await Donation.find({
      user: req.user.id,
      status: { $in: ["Pending", "Processing"] },
    })
      .sort({ createdAt: -1 })
      .select("title credits donationType createdAt");

    console.log("📦 Pending donations found:", pendingDonations.length);

    const pendingEntries = (pendingDonations || []).map((d) => ({
      type: "pending", // ✅ Frontend expects "pending" type
      amount: d.credits || 0,
      reason: `Donation pending: ${d.title || d.donationType || "donation"}`,
      status: "pending", // ✅ Frontend expects "pending" status
      date: d.createdAt,
    }));

    // ✅ Map stored creditHistory (convert status from "confirmed" to "earned")
    const finalizedHistory = (user.creditHistory || []).map((h) => {
      // Convert status for frontend compatibility
      let status = h.status;
      if (h.status === "confirmed") status = "earned";
      if (h.status === "earned") status = "earned"; // Keep as is
      if (h.status === "pending") status = "pending"; // Keep as is
      
      return {
        type: h.type, // Should be "earn" or "spend"
        amount: h.amount,
        reason: h.reason,
        status: status, // ✅ Now "earned" instead of "confirmed"
        date: h.date || h.createdAt || new Date(),
      };
    });

    // ✅ Merge both finalized + pending
    const history = [...finalizedHistory, ...pendingEntries];

    // ✅ Return EXACT structure frontend expects
    const responseData = {
      earned: user.credits || 0,
      pending: user.pendingCredits || 0,
      history: history,
    };

    console.log("📤 Sending response:", {
      earned: responseData.earned,
      pending: responseData.pending,
      historyEntries: responseData.history.length
    });

    res.json(responseData);
  } catch (err) {
    console.error("❌ getCredits error:", err);
    res
      .status(500)
      .json({ message: "Error fetching credits", error: err.message });
  }
};

module.exports = { getAllUsers, getCredits };