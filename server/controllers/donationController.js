const Donation = require("../models/Donation");

// Create a new donation
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
      transactionId, // fallback (e.g. UPI)
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    // -------------------------------
    // Basic validations
    // -------------------------------
    if (!donorName || !donorEmail || !donationType) {
      return res.status(400).json({
        message: "Donor name, email, and donation type are required.",
      });
    }

    // -------------------------------
    // Money donation validations
    // -------------------------------
    if (donationType === "money") {
      if (!amount || Number(amount) <= 0) {
        return res.status(400).json({ message: "Valid amount is required." });
      }

      // Accept either Razorpay fields OR manual transactionId
      const hasRazorpay =
        razorpayPaymentId && razorpayOrderId && razorpaySignature;

      if (!transactionId && !hasRazorpay) {
        return res.status(400).json({
          message:
            "Valid payment details are required for money donations (transactionId or Razorpay response).",
        });
      }
    }

    // -------------------------------
    // Item donation validations
    // -------------------------------
    if (donationType === "item") {
      if (!quantity || Number(quantity) <= 0) {
        return res.status(400).json({ message: "Quantity is required." });
      }
    }

    // -------------------------------
    // Blood donation validations
    // -------------------------------
    if (donationType === "blood") {
      if (!bloodGroup || !date || !location) {
        return res.status(400).json({
          message:
            "Blood group, date, and location are required for blood donations.",
        });
      }
    }

    // -------------------------------
    // Build donation object
    // -------------------------------
    const donation = new Donation({
      title: title || "",
      category: category || "",
      donorName,
      donorEmail,
      donationType,
      status: "Pending",

      // Money donation fields
      amount: donationType === "money" ? Number(amount) : undefined,
      transactionId:
        donationType === "money"
          ? transactionId || razorpayPaymentId
          : undefined,
      paymentMethod: donationType === "money" ? "Razorpay" : undefined,
      paymentStatus: donationType === "money" ? "Verified" : undefined,

      // Item donation fields
      quantity: donationType === "item" ? Number(quantity) : undefined,
      notes: donationType === "item" ? notes : undefined,
      image: req.file ? req.file.filename : "",

      // Blood donation fields
      bloodGroup: donationType === "blood" ? bloodGroup : undefined,
      date: donationType === "blood" ? date : undefined,
      location: donationType === "blood" ? location : undefined,
    });

    // Save to database
    await donation.save();
    return res
      .status(201)
      .json({ message: "Donation saved successfully.", donation });
  } catch (err) {
    console.error("createDonation error:", err);
    return res
      .status(500)
      .json({ message: "Error saving donation.", error: err.message });
  }
};

// Get all donations
const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    return res.json(donations);
  } catch (err) {
    console.error("getDonations error:", err);
    return res
      .status(500)
      .json({ message: "Error fetching donations.", error: err.message });
  }
};

// Get donations of the current user
const getMyDonations = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res
        .status(401)
        .json({ message: "Unauthorized: email not found in token." });
    }

    const donations = await Donation.find({ donorEmail: email }).sort({
      createdAt: -1,
    });
    return res.json(donations);
  } catch (err) {
    console.error("getMyDonations error:", err);
    return res.status(500).json({
      message: "Error fetching your donations.",
      error: err.message,
    });
  }
};

// Update donation status
const updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["Pending", "Processing", "Delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ message: "Donation not found." });
    }

    return res.json({
      message: `Donation status updated to ${status}.`,
      donation,
    });
  } catch (err) {
    console.error("updateDonationStatus error:", err);
    return res.status(500).json({
      message: "Error updating donation status.",
      error: err.message,
    });
  }
};

module.exports = {
  createDonation,
  getDonations,
  getMyDonations,
  updateDonationStatus,
};
