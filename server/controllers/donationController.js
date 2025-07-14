const Donation = require("../models/Donation");
const jwt = require("jsonwebtoken");

exports.createDonation = async (req, res) => {
  try {
    console.log("Incoming donation request:");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_secret);
    const userId = decoded.id;
    const { title, description, category, latitude, longitude, address } =
      req.body;

    const donation = await Donation.create({
      title,
      description,
      category,
      address,
      userId,
      image: req.file ? req.file.filename : null,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    });

    res.status(201).json(donation);
  } catch (err) {
    console.error("Donation creation failed:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Missing before! Add this:
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.query.userId });
    res.status(200).json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
