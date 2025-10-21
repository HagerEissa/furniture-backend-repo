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
        const userId = session.metadata.userId;
        const items = JSON.parse(session.metadata.items);
        const totalPrice = parseFloat(session.metadata.totalPrice);

        try {
        await Order.create({
            user: userId,
            products: items.map((item) => ({
            product: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            })),
            totalPrice,
            stripeSessionId: session.id,
            status: "Pending",
        });

        console.log("Order created for session:", session.id);
        } catch (dbErr) {
        console.error("Failed to save order:", dbErr);
        }
    }

    res.json({ received: true });
});

module.exports = router;