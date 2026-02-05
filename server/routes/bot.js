import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "threadsense_secret_key_123";

// REDDIT BOT CONFIG (User needs to add these to .env)
const REDDIT_CLIENT_ID = process.env.REDDIT_BOT_CLIENT_ID;
const REDDIT_CLIENT_SECRET = process.env.REDDIT_BOT_CLIENT_SECRET;
const REDDIT_USER = process.env.REDDIT_BOT_USERNAME;
const REDDIT_PASS = process.env.REDDIT_BOT_PASSWORD;

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access Denied" });
    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch (err) { res.status(400).json({ error: "Invalid Token" }); }
};

// AUTO-REPLY TO THREAD
router.post("/reply", verifyToken, async (req, res) => {
    const { threadId, summary } = req.body;

    if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET) {
        return res.status(400).json({ error: "Reddit Bot credentials missing in server .env" });
    }

    try {
        // 1. Get Reddit Access Token
        const auth = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString("base64");
        const tokenRes = await fetch("https://www.reddit.com/api/v1/access_token", {
            method: "POST",
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "ThreadSenseBot/0.1"
            },
            body: `grant_type=password&username=${REDDIT_USER}&password=${REDDIT_PASS}`
        }).then(r => r.json());

        const accessToken = tokenRes.access_token;

        // 2. Post Comment
        const replyRes = await fetch("https://oauth.reddit.com/api/comment", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "ThreadSenseBot/0.1"
            },
            body: `thing_id=t3_${threadId}&text=${encodeURIComponent("**ThreadSense AI Summary:**\n\n" + summary)}`
        }).then(r => r.json());

        res.json({ message: "Successfully posted to Reddit", data: replyRes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
