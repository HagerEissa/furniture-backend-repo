const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/order.model");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/create-checkout-session", authMiddleware, async (req, res) => {
  try {
    const { items, shippingInfo } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ error: "No items provided" });

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const userId = req.user._id;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: "http://localhost:4200/payment-success",
      cancel_url: "http://localhost:4200/checkout",
      metadata: {
        userId: userId.toString(),
        totalPrice: totalPrice.toString(),
        items: JSON.stringify(items),
      },
    });

    const orderData = {
      userId: userId, // بدل user: userId
      products: items.map((it) => ({
        productId: it.productId || it._id, // بدل product: it.id
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        total: it.price * it.quantity,
      })),
      totalPrice,
      paymentMethod: "stripe",
      status: "pending",
      stripeSessionId: session.id,
      shippingInfo,
    };

    await Order.create(orderData);

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
