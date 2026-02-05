import express from "express";
import jwt from "jsonwebtoken";
import Thread from "../models/Thread.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "threadsense_secret_key_123";

// Middleware to verify token (optional or required based on route)
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access Denied" });

    try {
        const verified = jwt.verify(token, SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

// SAVE THREAD ANALYSIS
router.post("/", verifyToken, async (req, res) => {
    try {
        const { url, title, summary, score, keywords, platform, category } = req.body;

        const newThread = new Thread({
            user: req.user.id,
            url,
            title,
            summary,
            score,
            keywords,
            platform: platform || "reddit",
            category: category || "Uncategorized"
        });

        const savedThread = await newThread.save();
        res.status(201).json(savedThread);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET SENTIMENT TRENDS (Last 10)
router.get("/trends", verifyToken, async (req, res) => {
    try {
        const threads = await Thread.find({ user: req.user.id })
            .select("score createdAt")
            .sort({ createdAt: -1 })
            .limit(10);

        // Reverse to show oldest to newest in chart
        res.json(threads.reverse().map(t => t.score));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SEARCH THREADS
router.get("/search", verifyToken, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);

        const threads = await Thread.find({
            user: req.user.id,
            $or: [
                { url: { $regex: q, $options: "i" } },
                { summary: { $regex: q, $options: "i" } },
                { category: { $regex: q, $options: "i" } },
                { keywords: { $in: [new RegExp(q, "i")] } }
            ]
        }).sort({ createdAt: -1 });

        res.json(threads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET USER HISTORY
router.get("/", verifyToken, async (req, res) => {
    try {
        const threads = await Thread.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(threads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET SINGLE THREAD
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.id);
        if (!thread) return res.status(404).json({ error: "Not found" });
        res.json(thread);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE THREAD
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        await Thread.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE CHAT HISTORY
router.patch("/:id/chat", verifyToken, async (req, res) => {
    try {
        const { chatHistory } = req.body;
        const updated = await Thread.findByIdAndUpdate(
            req.params.id,
            { chatHistory },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
