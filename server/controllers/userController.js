
const User = require("../models/User");
const Donation = require("../models/Donation");

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
      creditHistoryLength: user.creditHistory?.length || 0,
    });

    const pendingDonations = await Donation.find({
      user: req.user.id,
      status: { $in: ["Pending", "Processing"] },
    })
      .sort({ createdAt: -1 })
      .select("title credits donationType createdAt");

    console.log("📦 Pending donations found:", pendingDonations.length);

    const pendingEntries = (pendingDonations || []).map((d) => ({
      type: "pending", 
      amount: d.credits || 0,
      reason: `Donation pending: ${d.title || d.donationType || "donation"}`,
      status: "pending", 
      date: d.createdAt,
    }));

    const finalizedHistory = (user.creditHistory || []).map((h) => {
      let status = h.status;
      if (h.status === "confirmed") status = "earned";
      if (h.status === "earned") status = "earned";
      if (h.status === "pending") status = "pending";

      return {
        type: h.type,
        amount: h.amount,
        reason: h.reason,
        status: status,
        date: h.date || h.createdAt || new Date(),
      };
    });

    const history = [...finalizedHistory, ...pendingEntries];

    const responseData = {
      earned: user.credits || 0,
      pending: user.pendingCredits || 0,
      history: history,
    };

    console.log("📤 Sending response:", {
      earned: responseData.earned,
      pending: responseData.pending,
      historyEntries: responseData.history.length,
    });

    res.json(responseData);
  } catch (err) {
    console.error("❌ getCredits error:", err);
    res
      .status(500)
      .json({ message: "Error fetching credits", error: err.message });
  }
};

const getTopDonors = async (req, res) => {
  try {
    console.log("🏆 Fetching top donors leaderboard...");

    const topDonors = await User.find()
      .select("name email credits role")
      .sort({ credits: -1 })
      .limit(10);

    let userRank = null;
    let currentUser = null;

    if (req.user?.id) {
      currentUser = await User.findById(req.user.id).select(
        "name email credits role"
      );

      if (currentUser) {
        const rank = await User.countDocuments({
          credits: { $gt: currentUser.credits },
        });
        userRank = rank + 1; 
      }
    }

    console.log("✅ Leaderboard fetched:", {
      topDonors: topDonors.length,
      userRank,
    });

    res.json({
      topDonors,
      currentUser: currentUser
        ? {
            id: currentUser._id,
            name: currentUser.name,
            credits: currentUser.credits,
            rank: userRank,
          }
        : null,
    });
  } catch (err) {
    console.error("❌ getTopDonors error:", err);
    res
      .status(500)
      .json({ message: "Error fetching leaderboard", error: err.message });
  }
};

module.exports = { getAllUsers, getCredits, getTopDonors };
