const Request = require("../models/Request");
const jwt = require("jsonwebtoken");

exports.createRequest = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { item, urgency, quantity, coordinates, isNGO } = req.body;

    const request = await Request.create({
      item,
      urgency,
      quantity,
      userId,
      isNGO,
      location: {
        type: "Point",
        coordinates: coordinates.map(Number), // [lng, lat]
      },
    });

    res.status(201).json(request);
  } catch (err) {
    console.error("Request creation error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate("userId", "name email");
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
