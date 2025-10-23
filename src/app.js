const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
require("./config/passport.config");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const authRoutes = require("./routes/auth.route");
const oauthRoutes = require("./routes/oauth.route");
const categoryRouter = require('./routes/category.router');
const productRouter = require('./routes/product.router');
const cartRouter = require('./routes/cart.router')
const favouriteRouter = require('./routes/favourite.router')
const orderRouter = require('./routes/order.router');
const reviewRoutes = require("./routes/review.route");
const userRoutes = require("./routes/user.route");
const paymentRoutes = require("./routes/payment.route");
const webhookRoutes = require("./routes/webhook.route");

const app = express();
app.use(
    helmet({
        contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'","data:","blob:","res.cloudinary.com",],
            scriptSrc: ["'self'","'unsafe-inline'",],
            styleSrc: ["'self'","'unsafe-inline'",],
            connectSrc: ["'self'", "http://localhost:4200",],
        },
        },
    })
);

app.use(
    cors({
        origin: "http://localhost:4200",
        credentials: true,
    })
);

app.use("/api/webhook", express.raw({ type: "application/json" }), webhookRoutes);
app.use(express.json());
app.use(morgan("dev"));

app.use(passport.initialize());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// app.use('/images',express.static('./uploads'));//to access it by /images in angular  http://localhost:3000/images/product1.jpg
// https://res.cloudinary.com/dsso9spcd/image/upload/furniture/xsioiooxlj3k6wxsv1xq

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
app.use("/api/payment", paymentRoutes);

app.use('/api/product',productRouter);
app.use('/api/category',categoryRouter);
app.use('/api/cart',cartRouter);
app.use('/api/favourite',favouriteRouter);
app.use('/api/orders', orderRouter);


app.use((req,res)=>{
    res.status(404).json({ message: "Route not found" });
});

module.exports = app;
