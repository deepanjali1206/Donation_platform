const express = require("express");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");
const {
  createDonation,
  getDonations,
  getMyDonations,
} = require("../controllers/donationController");

const router = express.Router();

router.post("/", upload.single("image"), createDonation);
router.get("/", getDonations);
router.get("/me", auth, getMyDonations);

module.exports = router;
