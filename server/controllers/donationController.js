// server/controllers/donationController.js
const Donation = require("../models/Donation");

const createDonation = async (req, res) => {
  try {
    const { title, category, donorName, donorEmail, amount } = req.body;

    if (!title || !category || !donorName || !donorEmail || !amount) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const donation = new Donation({
      title,
      category,
      donorName,
      donorEmail,
      amount: Number(amount),
      image: req.file ? req.file.filename : "", // store filename only
    });

    await donation.save();
    return res.status(201).json({ message: "Donation saved", donation });
  } catch (err) {
    console.error("createDonation error:", err);
    return res.status(500).json({ message: "Error saving donation", error: err.message });
  }
};

const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    return res.json(donations);
  } catch (err) {
    console.error("getDonations error:", err);
    return res.status(500).json({ message: "Error fetching donations", error: err.message });
  }
};

const getMyDonations = async (req, res) => {
  try {
    const email = req.user?.email; // <- comes from JWT
    if (!email) {
      return res.status(401).json({ message: "Unauthorized: email not found in token" });
    }

    const donations = await Donation.find({ donorEmail: email }).sort({ createdAt: -1 });
    return res.json(donations);
  } catch (err) {
    console.error("getMyDonations error:", err);
    return res.status(500).json({ message: "Error fetching my donations", error: err.message });
  }
};

module.exports = { createDonation, getDonations, getMyDonations };
