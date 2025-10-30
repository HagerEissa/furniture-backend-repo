const { verifyToken } = require("../utils/jwt.util");
const User = require("../models/user.model");

async function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = verifyToken(token);

        const userId = decoded.id || decoded._id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: " + error.message });
    }
}

module.exports = authMiddleware;
