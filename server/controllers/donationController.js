
const Donation = require("../models/Donation");
const User = require("../models/User");

const CREDIT_RULES = {
  MONEY_PER_100_RUPEES: 10, 
  ITEM_PER_UNIT: 5,         
  BLOOD_FIXED: 20,         
};

function calculateCredits({ donationType, amount = 0, quantity = 0 }) {
  if (donationType === "money") {
    return Math.floor((Number(amount) || 0) / 100) * CREDIT_RULES.MONEY_PER_100_RUPEES;
  }
  if (donationType === "item") {
    return (Number(quantity) || 0) * CREDIT_RULES.ITEM_PER_UNIT;
  }
  if (donationType === "blood") {
    return CREDIT_RULES.BLOOD_FIXED;
  }
  return 0;
}

const createDonation = async (req, res) => {
  try {
    const {
      title,
      category,
      donorName,
      amount,
      quantity,
      notes,
      donationType,
      bloodGroup,
      date,
      location,
      transactionId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!donorName || !donationType) {
      return res.status(400).json({ message: "Donor name and donation type are required." });
    }

    if (donationType === "money") {
      if (!amount || Number(amount) <= 0) {
        return res.status(400).json({ message: "Valid amount is required." });
      }
      const hasRazorpay = razorpayPaymentId && razorpayOrderId && razorpaySignature;
      if (!transactionId && !hasRazorpay) {
        return res.status(400).json({
          message:
            "Valid payment details are required for money donations (transactionId or Razorpay).",
        });
      }
    }

    if (donationType === "item" && (!quantity || Number(quantity) <= 0)) {
      return res.status(400).json({ message: "Quantity is required." });
    }

    if (donationType === "blood" && (!bloodGroup || !date || !location)) {
      return res.status(400).json({
        message: "Blood group, date, and location are required for blood donations.",
      });
    }

    const donation = new Donation({
      title: title || "",
      category: category || "",
      donorName,
      donorEmail: user.email,
      user: user._id,
      donationType,
      status: "Pending",
      amount: donationType === "money" ? Number(amount) : undefined,
      transactionId: donationType === "money" ? transactionId || razorpayPaymentId : undefined,
      paymentMethod: donationType === "money" ? "Razorpay" : undefined,
      paymentStatus: donationType === "money" ? "Verified" : undefined,
      quantity: donationType === "item" ? Number(quantity) : undefined,
      notes: donationType === "item" ? notes : undefined,
      image: req.file ? req.file.filename : "",
      bloodGroup: donationType === "blood" ? bloodGroup : undefined,
      date: donationType === "blood" ? date : undefined,
      location: donationType === "blood" ? location : undefined,
    });

    const credits = calculateCredits({ donationType, amount, quantity });
    donation.credits = credits;

    await donation.save();

    if (credits > 0) {
      user.pendingCredits = (user.pendingCredits || 0) + credits;

      user.creditHistory = user.creditHistory || [];
      user.creditHistory.push({
        type: "earn",
        amount: credits,
        reason: `${donationType} donation submitted`, 
        status: "pending",
        date: new Date(),
      });

      await user.save();
    }

    return res.status(201).json({
      message: "Donation submitted successfully (awaiting admin approval).",
      donation,
      updatedEarned: user.credits,
      updatedPending: user.pendingCredits,
    });
  } catch (err) {
    console.error("❌ createDonation error:", err);
    return res.status(500).json({ message: "Error saving donation.", error: err.message });
  }
};


const updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !["Pending", "Processing", "Delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: "Donation not found." });

    const prevStatus = donation.status;
    donation.status = status;
    await donation.save();

    if (prevStatus !== "Delivered" && status === "Delivered") {
      const user = await User.findById(donation.user);
      if (!user) {
        return res.status(404).json({ message: "User linked to donation not found." });
      }

      const earnedCredits = Number(donation.credits) || 0;

      user.pendingCredits = Math.max((user.pendingCredits || 0) - earnedCredits, 0);
      user.credits = (user.credits || 0) + earnedCredits;

      let historyEntry = user.creditHistory
        .slice() 
        .reverse() 
        .find(
          (h) =>
            h.type === "earn" &&
            h.status === "pending" &&
            Number(h.amount) === earnedCredits &&
            typeof h.reason === "string" &&
            h.reason.includes(donation.donationType) &&
            h.reason.includes("submitted")
        );

      if (historyEntry) {
        
        const idx = user.creditHistory.findIndex(
          (h) =>
            h.type === historyEntry.type &&
            h.status === "pending" &&
            Number(h.amount) === historyEntry.amount &&
            h.reason === historyEntry.reason &&
            h.date.getTime() === historyEntry.date.getTime()
        );
        if (idx > -1) {
          user.creditHistory[idx].status = "earned";
          user.creditHistory[idx].reason = `${donation.donationType} donation approved`;
          user.creditHistory[idx].date = new Date();
        }
      } else {
        
        user.creditHistory.push({
          type: "earn",
          amount: earnedCredits,
          reason: `${donation.donationType} donation approved`,
          status: "earned",
          date: new Date(),
        });
      }

      await user.save();

      return res.json({
        message: "Donation marked as Delivered. Credits awarded.",
        donation,
        updatedEarned: user.credits,
        updatedPending: user.pendingCredits,
      });
    }

    return res.json({ message: `Donation status updated to ${status}.`, donation });
  } catch (err) {
    console.error("❌ updateDonationStatus error:", err);
    return res.status(500).json({ message: "Error updating donation status.", error: err.message });
  }
};


const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    return res.json(donations);
  } catch (err) {
    console.error("❌ getDonations error:", err);
    return res.status(500).json({ message: "Error fetching donations.", error: err.message });
  }
};


const getMyDonations = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const donations = await Donation.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(donations);
  } catch (err) {
    console.error("❌ getMyDonations error:", err);
    return res.status(500).json({ message: "Error fetching your donations.", error: err.message });
  }
};

module.exports = {
  createDonation,
  getDonations,
  getMyDonations,
  updateDonationStatus,
};
