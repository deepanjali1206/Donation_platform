// routes/donationRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middlewares/auth");

// Controllers
const {
  createDonation,
  getDonations,
  getMyDonations,
  updateDonationStatus,
} = require("../controllers/donationController");

// Multer settings (uploads/)
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

// Routes
router.post("/", auth, upload.single("image"), createDonation);

// 🔐 Get all donations (admin only)
router.get("/", auth, getDonations);

// 👤 Get my donations
router.get("/me", auth, getMyDonations);

// ✅ Approve/Reject donation (admin only)
router.put("/:id/status", auth, updateDonationStatus);

module.exports = router;
