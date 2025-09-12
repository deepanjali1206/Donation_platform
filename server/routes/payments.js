const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
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
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json(order);

  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    return res.status(500).json({ error: "Error creating Razorpay order" });
  }
});

// Route to verify payment
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Create expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
    
    // Verify signature
    const isAuthentic = expectedSignature === razorpay_signature;
    
    if (isAuthentic) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: "Invalid signature" });
    }
  } catch (err) {
    console.error("Error verifying payment:", err);
    return res.status(500).json({ error: "Error verifying payment" });
  }
});

module.exports = router;