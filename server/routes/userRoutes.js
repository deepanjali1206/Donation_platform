// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { getAllUsers, getCredits } = require("../controllers/userController");

// Get all users (admin)
router.get("/", getAllUsers);

// Get credits for logged-in user
router.get("/me/credits", auth, getCredits);

module.exports = router;
