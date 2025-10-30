const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/order.model");

router.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const sessionId = session.id;

    try {
      const order = await Order.findOne({ stripeSessionId: sessionId });
      if (order) {
        order.status = "processing"; 
        await order.save();
        console.log(" Order updated to paid:", sessionId);
      } else {
        console.warn("No order found for session:", sessionId);
      }
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  }

  res.json({ received: true });
});

module.exports = router;
