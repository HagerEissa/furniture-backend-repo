const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
require("./config/passport.config");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const FRONTEND_URL = "https://furniturefrontendrepo.vercel.app";

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
const webhookRoutes = require("./routes/webhook.route");

const app = express();

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "blob:", "res.cloudinary.com"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                connectSrc: ["'self'", "http://localhost:4200", FRONTEND_URL],
            },
        },
    })
);

const allowedOrigins = ["http://localhost:4200", FRONTEND_URL];
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg =
                    "The CORS policy for this site does not allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
);

app.use("/api/webhook", express.raw({ type: "application/json" }), webhookRoutes);
app.use(express.json());
app.use(morgan("dev"));
app.use(passport.initialize());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(apiLimiter);


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


app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

module.exports = app;
