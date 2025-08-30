const express = require("express");
const router = express.Router();
const {
  createRequest,
  getRequests,
  getMyRequests,
} = require("../controllers/requestController");

// Create new request (auth handled inside controller via token)
router.post("/", createRequest);

// Get all requests
router.get("/", getRequests);

// ✅ Get logged-in user's requests
router.get("/my-requests", getMyRequests);

module.exports = router;
