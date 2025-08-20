const express = require("express");
const upload = require("../middlewares/upload");
const {
  createDonation,
  getDonations,
  getMyDonations,
} = require("../controllers/donationController");

const router = express.Router();

// Create donation with file upload
router.post("/", upload.single("file"), createDonation);

// Get all donations
router.get("/", getDonations);

// Get my donations (by donorEmail)
router.get("/me", getMyDonations);

module.exports = router;
