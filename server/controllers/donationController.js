const Donation = require("../models/Donation");

// ✅ Create a donation
const createDonation = async (req, res) => {
  try {
    const { title, category, donorName, donorEmail, amount } = req.body;

    const donation = new Donation({
      title,
      category,
      donorName,
      donorEmail,
      amount,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    await donation.save();
    res.status(201).json({ message: "Donation saved", donation });
  } catch (err) {
    res.status(500).json({ message: "Error saving donation", error: err.message });
  }
};

// ✅ Get all donations
const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching donations", error: err.message });
  }
};

// ✅ Get my donations (filtered by email)
const getMyDonations = async (req, res) => {
  try {
    const { email } = req.query; // frontend will pass donorEmail
    if (!email) return res.status(400).json({ message: "Email is required" });

    const donations = await Donation.find({ donorEmail: email }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching my donations", error: err.message });
  }
};

module.exports = { createDonation, getDonations, getMyDonations };
