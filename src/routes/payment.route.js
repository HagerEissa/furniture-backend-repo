// const express = require("express");
// const router = express.Router();
// const Stripe = require("stripe");
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// router.post("/create-checkout-session", async (req, res) => {
//   try {
//     const { items, userId } = req.body;

//     if (!items || items.length === 0)
//       return res.status(400).json({ error: "No items provided" });

//     const totalPrice = items.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: items.map((item) => ({
//         price_data: {
//           currency: "usd",
//           product_data: { name: item.title },
//           unit_amount: item.price * 100,
//         },
//         quantity: item.quantity,
//       })),
//       success_url: "http://localhost:3000/payment-success",
//       cancel_url: "http://localhost:3000/payment-cancel",
//       metadata: {
//         userId,
//         items: JSON.stringify(
//           items.map((i) => ({ id: i._id, quantity: i.quantity }))
//         ),
//       },
//     });

//     res.json({ url: session.url });
//   } catch (err) {
//     console.error("Stripe checkout error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { items, userId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items provided" });
    }

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.title },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      success_url: "http://localhost:3000/payment-success",
      cancel_url: "http://localhost:3000/payment-cancel",
      metadata: {
        userId,
        totalAmount: totalPrice,
        items: JSON.stringify(
          items.map((i) => ({
            id: i._id,
            quantity: i.quantity,
            price: i.price,
          }))
        ),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;