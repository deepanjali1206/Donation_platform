const express = require("express");
const upload = require("../middlewares/upload");
const {
  createDonation,
  getDonations,
  getMyDonations,
} = require("../controllers/donationController");

const router = express.Router();

// POST with image
router.post("/", upload.single("image"), createDonation);

router.get("/", getDonations);
router.get("/me", getMyDonations);

module.exports = router;
