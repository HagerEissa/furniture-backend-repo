const User = require("../models/user.model");
const ROLES = require("../utils/roles.util");
const { generateToken } = require("../utils/jwt.util");
const cloudinary = require("../config/cloudinary.config");
const fs = require("fs");
const { registerSchema, loginSchema } = require("../validators/auth.validator");


exports.register = async (req, res) => {
    try {
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
        return res.status(400).json({ message: error.details[0].message });
        }

        const { name, email, password, phone } = value;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
        }

        let avatarUrl;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "avatar",
                use_filename: true,
                unique_filename: true,
                resource_type: "image",
            });

            avatarUrl = result.secure_url;

            fs.unlinkSync(req.file.path);
        }

        if (!avatarUrl) {
        avatarUrl =
            "https://res.cloudinary.com/dsso9spcd/image/upload/v1760809850/avatar/default-avatar.png";
        }

        const newUser = await User.create({
            name,
            email,
            password,
            phone,
            avatar: avatarUrl,
            role: ROLES.USER,
            loginMethod: "local",
        });

        const token = generateToken({
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        });

        res.status(201).json({ user: newUser, token });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { email, password } = value;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = generateToken({ id: user._id, email: user.email, role: user.role });

        res.json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


