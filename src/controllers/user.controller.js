const User = require("../models/user.model");
const ROLES = require("../utils/roles.util");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

exports.updateProfile = async (req, res) => {
    try {
        if (!req.user)
        return res.status(401).json({ message: "User not authenticated" });

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { name, email, phone, oldPassword, newPassword } = req.body;

        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;

        if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "avatar",
            public_id: `user-${user._id}`,
            overwrite: true,
        });
        user.avatar = result.secure_url;
        fs.unlinkSync(req.file.path);
        }

        if (!user.avatar) {
        user.avatar =
            "https://res.cloudinary.com/dsso9spcd/image/upload/v1760809850/avatar/default-avatar.png";
        }

        if (oldPassword && newPassword) {
        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch)
            return res.status(400).json({ message: "Old password is incorrect" });
        user.password = newPassword;
        }

        await user.save();
        res.json({ message: "Profile updated", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateRole = async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
        return res.status(403).json({ message: "You cannot change your own role." });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { role } = req.body;
        if (!Object.values(ROLES).includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
        }

        user.role = role;
        await user.save();

        res.json({ message: "Role updated successfully", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
        return res.status(403).json({ message: "You cannot delete your own account." });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.deleteOne();

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};