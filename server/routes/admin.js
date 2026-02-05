import express from "express";
import User from "../models/User.js";
import Thread from "../models/Thread.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "SUPERSECRET");
        const user = await User.findById(decoded.id);
        if (!user || (user.role !== "admin" && user.role !== "owner")) {
            return res.status(403).json({ error: "Forbidden: Admin access only" });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};

// Get stats
router.get("/stats", isAdmin, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const threadCount = await Thread.countDocuments();
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
        const recentThreads = await Thread.find().sort({ createdAt: -1 }).populate("user", "username").limit(5);

        res.json({
            userCount,
            threadCount,
            recentUsers,
            recentThreads
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all users
router.get("/users", isAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
