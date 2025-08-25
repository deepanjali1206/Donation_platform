const Donation = require("../models/Donation");


const createDonation = async (req, res) => {
  try {
    const {
      title,
      category,
      donorName,
      donorEmail,
      amount,
      quantity,
      notes,
      donationType,
      bloodGroup,
      date,
      location,
      transactionId,
    } = req.body;

    if (!donorName || !donorEmail || !donationType) {
      return res
        .status(400)
        .json({ message: "Donor name, email and donation type are required." });
    }

    if (donationType === "money") {
      if (!amount || Number(amount) <= 0) {
        return res.status(400).json({ message: "Valid amount is required." });
      }
      if (!transactionId || String(transactionId).trim().length < 8) {
        return res.status(400).json({
          message: "Valid Transaction ID is required for money donations.",
        });
      }
    }

    if (donationType === "item") {
      if (!quantity || Number(quantity) <= 0) {
        return res.status(400).json({ message: "Quantity is required." });
      }
    }

    if (donationType === "blood") {
      if (!bloodGroup || !date || !location) {
        return res.status(400).json({
          message: "Blood group, date and location are required.",
        });
      }
    }

    const donation = new Donation({
      title: title || "",
      category: category || "",
      donorName,
      donorEmail,

      amount: donationType === "money" ? Number(amount) : undefined,
      transactionId: donationType === "money" ? transactionId : undefined,

      quantity: donationType === "item" ? Number(quantity) : undefined,
      notes: donationType === "item" ? notes : undefined,
      image: req.file ? req.file.filename : "",

      bloodGroup: donationType === "blood" ? bloodGroup : undefined,
      date: donationType === "blood" ? date : undefined,
      location: donationType === "blood" ? location : undefined,

      donationType,
      paymentMethod: donationType === "money" ? "UPI-QR" : undefined,
      paymentStatus: donationType === "money" ? "Unverified" : undefined,


      status: "pending",
    });

    await donation.save();
    return res.status(201).json({ message: "Donation saved", donation });
  } catch (err) {
    console.error("createDonation error:", err);
    return res
      .status(500)
      .json({ message: "Error saving donation", error: err.message });
  }
};


const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    return res.json(donations);
  } catch (err) {
    console.error("getDonations error:", err);
    return res
      .status(500)
      .json({ message: "Error fetching donations", error: err.message });
  }
};


const getMyDonations = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res
        .status(401)
        .json({ message: "Unauthorized: email not found in token" });
    }

    const donations = await Donation.find({ donorEmail: email }).sort({
      createdAt: -1,
    });
    return res.json(donations);
  } catch (err) {
    console.error("getMyDonations error:", err);
    return res
      .status(500)
      .json({ message: "Error fetching my donations", error: err.message });
  }
};


const updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !["Pending", "Processing", "Delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.json({ message: `Donation ${status} successfully`, donation });
  } catch (err) {
    console.error("updateDonationStatus error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createDonation,
  getDonations,
  getMyDonations,
  updateDonationStatus,
};
