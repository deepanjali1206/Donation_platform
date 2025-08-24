const express = require("express");
const router = express.Router();
const {
  createRequest,
  getRequests,
} = require("../controllers/requestController");

// POST: create new request
router.post("/", createRequest);

// GET: all requests
router.get("/", getRequests);

module.exports = router;
