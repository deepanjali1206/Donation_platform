const express = require("express");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");
const {
  createDonation,
  getDonations,
  getMyDonations,
  updateDonationStatus,
} = require("../controllers/donationController");

const router = express.Router();


router.post("/", upload.single("image"), createDonation);


router.get("/", getDonations);


router.get("/me", auth, getMyDonations);


router.put("/:id/status", updateDonationStatus);

module.exports = router;
