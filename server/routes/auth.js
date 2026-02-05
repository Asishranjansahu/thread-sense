import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "threadsense_secret_key_123";

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check existing
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        // Create Token
        const token = jwt.sign({ id: savedUser._id }, SECRET, { expiresIn: "7d" });

        res.status(201).json({
            token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        // Check password
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ error: "Invalid password" });

        // Create Token
        const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET USER (Protected)
router.get("/me", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Access Denied" });

        const verified = jwt.verify(token, SECRET);
        const user = await User.findById(verified.id).select("-password");

        res.json(user);
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
});

export default router;
