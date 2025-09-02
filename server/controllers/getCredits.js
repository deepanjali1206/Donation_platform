// controllers/getCredits.js
const Donation = require("../models/Donation");
const Request = require("../models/Request");

exports.getCredits = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ Earned credits = Delivered donations
    const earnedAgg = await Donation.aggregate([
      { $match: { user: userId, status: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$credits" } } }
    ]);
    const earned = earnedAgg[0]?.total || 0;

    // ✅ Pending credits = Pending + Processing
    const pendingAgg = await Donation.aggregate([
      { $match: { user: userId, status: { $in: ["Pending", "Processing"] } } },
      { $group: { _id: null, total: { $sum: "$credits" } } }
    ]);
    const pending = pendingAgg[0]?.total || 0;

    // ✅ Spent credits = Requests where credits were used
    const spentAgg = await Request.aggregate([
      { $match: { user: userId, creditsUsed: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: "$creditsUsed" } } }
    ]);
    const spent = spentAgg[0]?.total || 0;

    // ✅ Donation History
    const donationHistory = await Donation.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("credits status createdAt title")
      .lean();

    const formattedDonations = donationHistory.map((d) => ({
      amount: d.credits,
      type: d.status === "Delivered" ? "earn" : "pending",
      reason: `Donation: ${d.title || "N/A"}`,
      date: d.createdAt,
    }));

    // ✅ Request History
    const requestHistory = await Request.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("creditsUsed priority status createdAt type isFree")
      .lean();

    const formattedRequests = requestHistory.map((r) => ({
      amount: r.isFree ? 0 : r.creditsUsed,
      type: r.isFree ? "free-request" : "spend",
      reason: `Request: ${r.type} (${r.priority})`,
      date: r.createdAt,
      status: r.status,
    }));

    // ✅ Combine histories
    const history = [...formattedDonations, ...formattedRequests].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // ✅ Balance = Earned - Spent
    const balance = earned - spent;

    // ✅ Gamification level
    let level = "Bronze";
    if (earned > 200) level = "Gold";
    else if (earned > 50) level = "Silver";

    res.json({
      earned,
      pending,
      spent,
      balance,
      level,
      history,
    });
  } catch (err) {
    console.error("❌ Error in getCredits:", err);
    res.status(500).json({ message: "Server error fetching credits" });
  }
};
