const express = require("express");
// const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const rateLimit = require("express-rate-limit");
const categoryRouter = require('./routes/category.router');
const productRouter = require('./routes/product.router');
const cartRouter = require('./routes/cart.router')
const favouriteRouter = require('./routes/favourite.router')
const orderRouter = require('./routes/order.router');

const app = express();

app.use(express.json());

app.use(morgan("dev"));

// app.use(cors({
//     origin:'http://localhost:4200' //front route
// }));

// app.use(
//     cors({
//         origin: "",
//         credentials: true,
//     })
// );

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));


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


app.use('/product',productRouter);
app.use('/category',categoryRouter);
app.use('/cart',cartRouter);
app.use('/favourite',favouriteRouter);
app.use('/orders', orderRouter);


app.use((req,res)=>{
    res.status(404).json({ message: "Route not found" });
});

module.exports = app;
