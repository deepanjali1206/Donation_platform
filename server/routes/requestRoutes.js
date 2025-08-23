// server/routes/requestRoutes.js
const express = require("express");
const router = express.Router();
const { createRequest, getRequests } = require("../controllers/requestController");

// POST - create new donation request
router.post("/", createRequest);

// GET - get all donation requests
router.get("/", getRequests);

module.exports = router;
