const Request = require("../models/Request");
const jwt = require("jsonwebtoken");

// ✅ Create a new request
exports.createRequest = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    let userId = null;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }

    const {
      title,
      category,
      requesterName,
      requesterEmail,
      item,
      urgency,
      quantity,
      amount,
      notes,
      bloodGroup,
      date,
      location,
      isNGO,
    } = req.body;

    const request = await Request.create({
      title,
      category,
      requesterName,
      requesterEmail,
      item,
      urgency,
      quantity,
      amount,
      notes,
      bloodGroup,
      date,
      location,
      isNGO,
      user: userId,
    });

    res.status(201).json(request);
  } catch (err) {
    console.error("❌ Request creation error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all requests
exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate("user", "name email");
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get logged-in user's requests only
exports.getMyRequests = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    let userId = null;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }

    const requests = await Request.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.error("❌ Error fetching my requests:", err);
    res.status(500).json({ error: err.message });
  }
};
