// server/routes/donationRoutes.js
const express = require("express");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");
const {
  createDonation,
  getDonations,
  getMyDonations,
} = require("../controllers/donationController");

const router = express.Router();

// Create donation (public) with file upload; field name is "image"
router.post("/", upload.single("image"), createDonation);

// Public: get all donations
router.get("/", getDonations);

// Private: get my donations (by email in token)
router.get("/me", auth, getMyDonations);

module.exports = router;
