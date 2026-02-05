import express from "express";
import Organization from "../models/Organization.js";
import User from "../models/User.js";
import Thread from "../models/Thread.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "threadsense_secret_key_123";

// Middleware to verify token
const verify = (req, res, next) => {
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

// CREATE ORGANIZATION
router.post("/create", verify, async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        // Check if user already has an org
        const user = await User.findById(userId);
        if (user.organization) return res.status(400).json({ error: "User already belongs to an organization" });

        const newOrg = new Organization({
            name,
            owner: userId,
            members: [userId],
            tier: "free"
        });

        const savedOrg = await newOrg.save();

        // Update user
        user.organization = savedOrg._id;
        user.role = "owner";
        await user.save();

        res.status(201).json(savedOrg);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET MY ORGANIZATION
router.get("/me", verify, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("organization");
        if (!user.organization) return res.status(404).json({ error: "No organization found" });

        const org = await Organization.findById(user.organization._id).populate("members", "username email avatar");

        // Get real thread count
        const threadCount = await Thread.countDocuments({ organization: org._id });

        res.json({ ...org.toObject(), threadCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// INVITE / ADD MEMBER (By Email)
router.post("/invite", verify, async (req, res) => {
    try {
        const { email } = req.body;
        const inviter = await User.findById(req.user.id);

        if (!inviter.organization || inviter.role === "member") {
            return res.status(403).json({ error: "Unauthorized to invite members" });
        }

        const targetUser = await User.findOne({ email });
        if (!targetUser) return res.status(404).json({ error: "Operative not found in database" });

        if (targetUser.organization) return res.status(400).json({ error: "Operative already assigned to an organization" });

        const org = await Organization.findById(inviter.organization);
        org.members.push(targetUser._id);
        await org.save();

        targetUser.organization = org._id;
        targetUser.role = "member";
        await targetUser.save();

        res.json({ message: `${targetUser.username} successfully recruited to ${org.name}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
