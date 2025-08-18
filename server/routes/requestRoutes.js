const express = require("express");
const Request = require("../models/request");
const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();

// POST /api/requests -> create a new request
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newRequest = new Request({ ...req.body, user: req.user._id });
    await newRequest.save();
    res.json(newRequest);
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/requests -> get all requests of logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
