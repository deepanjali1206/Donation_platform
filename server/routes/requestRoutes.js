// routes/requestRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middlewares/auth");

const {
  createRequest,
  getRequests,
  getMyRequests,
  approveRequest,
  rejectRequest,
  completeRequest,
  getRequestById,
} = require("../controllers/requestController");

// Multer for attachments
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});
const upload = multer({ storage });

router.post("/", auth, upload.single("attachment"), createRequest);
router.get("/", auth, getRequests); // admin/filtered as needed
router.get("/my-requests", auth, getMyRequests);

router.put("/:id/approve", auth, approveRequest);
router.put("/:id/reject", auth, rejectRequest);
router.put("/:id/complete", auth, completeRequest);

router.get("/:id", auth, getRequestById);

module.exports = router;
