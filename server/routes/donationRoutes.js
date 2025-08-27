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

// ----------------------
// Multer File Upload Setup
// ----------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to store uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 123456789.jpg
  },
});

const fileFilter = (req, file, cb) => {
  // Only allow images
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

// ----------------------
// Routes
// ----------------------

// Create a new donation (with optional image upload)
router.post("/", auth, upload.single("image"), createDonation);

// Get all donations
router.get("/", getDonations);

// Get donations of the logged-in user
router.get("/me", auth, getMyDonations);

// Update status of a donation (admin action)
router.put("/:id/status", auth, updateDonationStatus);

module.exports = router;
