const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
require("./config/passport.config");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const app = express(); // ✅ لازم يكون قبل أي app.use

// ✅ origins المسموح بيها
const allowedOrigins = [
  "http://localhost:4200",
  "https://furniturefrontendrepo.vercel.app",
  "https://furniturefrontendrepo.vercel.app/" // احتياطًا
];

// ✅ أمن الموقع باستخدام helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:", "res.cloudinary.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", ...allowedOrigins],
      },
    },
  })
);

// ✅ تفعيل CORS مرة واحدة فقط
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ✅ Stripe webhook لازم يكون قبل express.json()
const webhookRoutes = require("./routes/webhook.route");
app.use(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  webhookRoutes
);

// ✅ باقي الـ middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(passport.initialize());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiLimiter);

// ✅ استيراد كل الـ routes
const authRoutes = require("./routes/auth.route");
const oauthRoutes = require("./routes/oauth.route");
const reviewRoutes = require("./routes/review.route");
const userRoutes = require("./routes/user.route");
const contactRoutes = require("./routes/contact.route");
const categoryRouter = require("./routes/category.router");
const productRouter = require("./routes/product.router");
const cartRouter = require("./routes/cart.router");
const favouriteRouter = require("./routes/favourite.router");
const orderRouter = require("./routes/order.router");
const paymentRoutes = require("./routes/payment.route");

// ✅ ربط الـ routes
app.use("/api", authRoutes);
app.use("/api", oauthRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", reviewRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/cart", cartRouter);
app.use("/api/favourite", favouriteRouter);
app.use("/api/orders", orderRouter);

// ✅ لو المسار مش موجود
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
