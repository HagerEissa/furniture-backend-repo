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
        if(adminExists) return;
        
        const filePath = path.join(__dirname, "../uploads/avatar.png");
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "avatar",
            public_id: "default-avatar",
            overwrite: true,
        });

        const admin = new User({
            name: "Sandy Azzat",
            email: "sandyazzat@casanova.com",
            password: "Admin12356",
            phone: "+201234567890",
            avatar: result.secure_url, 
            role: ROLES.ADMIN,
        });

        await admin.save();

        console.log("Default admin user created");
    } catch (err) {
        console.error("Error creating default admin:", err);
    }
};

module.exports = defaultAdmin;