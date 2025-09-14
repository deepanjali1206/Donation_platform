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
  updateNGOStatus
} = require("../controllers/requestController");


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  }
});


const multiUpload = upload.any();

router.post("/", auth, multiUpload, createRequest);
router.get("/", auth, getRequests); 
router.get("/my-requests", auth, getMyRequests);

router.put("/:id/approve", auth, approveRequest);
router.put("/:id/reject", auth, rejectRequest);
router.put("/:id/complete", auth, completeRequest);
router.put("/:id/ngo-status", auth, updateNGOStatus);

router.get("/:id", auth, getRequestById);

module.exports = router;