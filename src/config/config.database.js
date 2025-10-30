const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("MongoDB Connected [Message From db.config.js]");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};

mongoose.connection.on("connected", () => console.log("Mongoose connected"));
mongoose.connection.on("open", () => console.log("Connection open"));
mongoose.connection.on("disconnected", () =>console.log("Mongoose disconnected"));
mongoose.connection.on("reconnected", () =>console.log("Mongoose reconnected"));
mongoose.connection.on("disconnecting", () =>console.log("Mongoose disconnecting"));
mongoose.connection.on("close", () => console.log("Connection closed"));

module.exports = connectDB;
