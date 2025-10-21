const dotenv = require("dotenv");
const connectDB = require("./src/config/config.database");
const app = require("./src/app");

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB()
    .then(()=>{
        console.log("MongoDB Connected [Message From server.js]");
        app.listen(PORT,()=>{
            console.log(`Server running on http://localhost:${PORT}`);
        })
    }).catch((err) => {
        console.error("Failed to connect to MongoDB:", err.message);
        process.exit(1);
    });
