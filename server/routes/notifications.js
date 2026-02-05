import express from "express";
import webpush from "web-push";
import jwt from "jsonwebtoken";
import Subscription from "../models/Subscription.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "threadsense_secret_key_123";

// VAPID keys - these should ideally be in .env
// Generate them using webpush.generateVAPIDKeys()
const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY || "BIsLzR...", // Placeholder
    privateKey: process.env.VAPID_PRIVATE_KEY || "..."     // Placeholder
};

if (process.env.VAPID_PUBLIC_KEY) {
    webpush.setVapidDetails(
        'mailto:admin@threadsense.ai',
        vapidKeys.publicKey,
        vapidKeys.privateKey
    );
}

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access Denied" });
    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch (err) { res.status(400).json({ error: "Invalid Token" }); }
};

// SUBSCRIBE
router.post("/subscribe", verifyToken, async (req, res) => {
    try {
        const { subscription } = req.body;
        const newSub = new Subscription({
            user: req.user.id,
            endpoint: subscription.endpoint,
            keys: subscription.keys
        });
        await newSub.save();
        res.status(201).json({ message: "Subscription saved" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SEND TEST NOTIFICATION
router.post("/send-test", verifyToken, async (req, res) => {
    try {
        const sub = await Subscription.findOne({ user: req.user.id });
        if (!sub) return res.status(404).json({ error: "No subscription found" });

        const payload = JSON.stringify({
            title: "ThreadSense Alert",
            body: "Scanning complete. Neural report ready.",
            icon: "/logo192.png"
        });

        await webpush.sendNotification(sub, payload);
        res.json({ message: "Notification sent" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
