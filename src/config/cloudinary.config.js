const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const path = require("path");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadDefaultAvatar() {
    try {
        const filePath = path.join(__dirname, "../uploads/avatar.png");
        await cloudinary.uploader.upload(filePath, {
            folder: "avatar",
            public_id: "default-avatar",
            overwrite: true,
        });

        // const result = await cloudinary.uploader.upload(filePath, {
        // folder: "avatar",
        // public_id: "default-avatar",
        // overwrite: true,
        // });
        // console.log("Uploaded Default Avatar:");
        // console.log(result.secure_url); 
    } catch (err) {
        console.error("Upload failed:", err);
    }
}

uploadDefaultAvatar();
