const cloudinary = require('cloudinary').v2;
const path = require('path');
const User = require("../models/user.model");
const ROLES = require("../utils/roles.util");
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const defaultAdmin = async () => {
    try {
    const adminExists = await User.findOne({ role: ROLES.ADMIN });
    if (adminExists) return;

    const filePath = path.join(__dirname, "../uploads/avatar.png");
    const result = await cloudinary.uploader.upload(filePath, {
        folder: "avatar",
        public_id: process.env.ADMIN_AVATAR || "default-avatar",
        overwrite: true,
    });

    const admin = new User({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        phone: process.env.ADMIN_PHONE,
        avatar: result.secure_url,
        role: process.env.ADMIN_ROLE || ROLES.ADMIN,
    });

    await admin.save();
    } catch {
    }
};


module.exports = defaultAdmin;