const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
require("dotenv").config(); // Make sure to load environment variables

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,        // Razorpay Key ID from .env
  key_secret: process.env.RAZORPAY_KEY_SECRET // Razorpay Key Secret from .env
});

// Route to create a Razorpay order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const options = {
      amount: Number(amount) * 100, // Razorpay expects amount in paise
      currency,
      payment_capture: 1,           // Auto-capture payment
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json(order);

  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    return res.status(500).json({ error: "Error creating Razorpay order" });
  }
});

module.exports = router;
