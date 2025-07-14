const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  createDonation,
  getDonations,
} = require("../controllers/donationController");

router.post("/", upload.single("image"), createDonation);
router.get("/", getDonations);

module.exports = router;
