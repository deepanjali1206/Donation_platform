const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth"); 
const { getNGOs, updateNGOStatus } = require("../controllers/ngoController");


router.get("/", auth, getNGOs);


router.put("/:id/status", auth, updateNGOStatus);

module.exports = router;
