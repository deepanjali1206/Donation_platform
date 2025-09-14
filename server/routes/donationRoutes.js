
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middlewares/auth");

const {
  createDonation,
  getDonations,
  getMyDonations,
  updateDonationStatus,
} = require("../controllers/donationController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post("/", auth, upload.single("image"), createDonation);

router.get("/", auth, getDonations);

router.get("/me", auth, getMyDonations);

router.put("/:id/status", auth, updateDonationStatus);

module.exports = router;
