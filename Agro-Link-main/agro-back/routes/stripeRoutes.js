// routes/stripeRoutes.js
const express = require("express");
const Stripe = require("stripe");
const router = express.Router();
const Order = require("../models/Order");

// Load environment variables
require('dotenv').config();

// Use secret key from environment variable (safer)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  const { items, buyerDetails } = req.body;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  // Map items and handle quantity and price
  const line_items = items.map(item => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.name,
      },
      unit_amount: item.price * 100, // convert to paisa
    },
    quantity: item.quantity || 1, // Ensure quantity is passed, else defaults to 1
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${frontendUrl}/buyer/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/cancel`,
      metadata: {
        buyer_name: buyerDetails?.name || '',
        buyer_address: buyerDetails?.address || '',
        buyer_phone: buyerDetails?.phone || '',
      },
    });

    await Order.create({
      stripeSessionId: session.id,
      paymentStatus: 'pending',
      amountTotal: line_items.reduce((total, item) => total + item.price_data.unit_amount * item.quantity, 0),
      buyerDetails: {
        name: buyerDetails?.name || '',
        address: buyerDetails?.address || '',
        phone: buyerDetails?.phone || ''
      },
      cartItems: items.map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1
      }))
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("Stripe Checkout Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/confirm-checkout-session", async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentStatus = session.payment_status || "unpaid";

    const updatedOrder = await Order.findOneAndUpdate(
      { stripeSessionId: sessionId },
      { paymentStatus },
      { new: true }
    );

    return res.status(200).json({
      paymentStatus,
      orderFound: Boolean(updatedOrder)
    });
  } catch (err) {
    console.error("Stripe Session Confirm Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
