const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { getAllUsers, getCredits, getTopDonors } = require("../controllers/userController");

router.get("/", getAllUsers);

router.get("/me/credits", auth, getCredits);

router.get("/top-donors", getTopDonors);

module.exports = router;
