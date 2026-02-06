import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
import fetch from "node-fetch";
import sendEmail from "../utils/email.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "threadsense_secret_key_123";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// GOOGLE AUTH
router.post("/google", async (req, res) => {
    try {
        const { idToken, accessToken, username } = req.body;
        let payload;

        if (idToken) {
            // Hardcoded fallback because Client ID is public and safe
            const clientId = process.env.GOOGLE_CLIENT_ID || "1069871585161-2msu0pn40pkimlk1ongbasesjfbl2qf2.apps.googleusercontent.com";

            const ticket = await client.verifyIdToken({
                idToken,
                audience: clientId,
            });
            payload = ticket.getPayload();
        } else if (accessToken) {
            const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
            if (!response.ok) throw new Error("Invalid access token");
            payload = await response.json();
        } else {
            return res.status(400).json({ error: "No token provided" });
        }

        const { sub, email, name, picture } = payload;
        const googleId = sub;

        let user = await User.findOne({ googleId });
        if (!user) {
            user = await User.findOne({ email });
            if (user) {
                user.googleId = googleId;
                if (picture && !user.avatar) user.avatar = picture;
                user.isVerified = true;
                await user.save();
            } else {
                user = new User({
                    username: username || name || email.split("@")[0],
                    email,
                    googleId,
                    avatar: picture,
                    isVerified: true,
                    password: await bcrypt.hash(Math.random().toString(36), 10)
                });
                await user.save();
            }
        }

        const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (err) {
        console.error("--- GOOGLE AUTH CRITICAL FAILURE ---");
        console.error("Error Detail:", err.message);
        console.error("Stack Trace:", err.stack);
        res.status(500).json({ error: "Google Authentication failed: " + err.message });
    }
});

// REGISTER (Step 1: Save User & Generate OTP)
router.post("/register", async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({
            $or: [
                ...(email ? [{ email }] : []),
                ...(phone ? [{ phone }] : [])
            ]
        });

        if (user && user.isVerified !== false) {
            return res.status(400).json({ error: "Identity already exists and is verified." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes

        const hashedPassword = await bcrypt.hash(password, 10);

        if (user) {
            // Update unverified user
            user.username = username;
            user.password = hashedPassword;
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        } else {
            // Create unverified user
            user = new User({
                username,
                email,
                phone,
                password: hashedPassword,
                otp,
                otpExpires,
                isVerified: false
            });
            await user.save();
        }

        if (email) {
            await sendEmail(
                email,
                "ThreadSense Identity Verification",
                `Your Neural Sync Code is: ${otp}`,
                `<div style="font-family: monospace; background: #000; color: #00f3ff; padding: 20px; border-radius: 10px;">
                    <h2>NEURAL LINK PROTOCOL</h2>
                    <p>Identity verification requested.</p>
                    <h1 style="font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    <p>This frequency expires in 10 minutes.</p>
                 </div>`
            );
        }

        console.log(`📡 [NEURAL TRANSMISSION] OTP for ${email || phone}: ${otp}`);

        res.status(200).json({
            message: "OTP transmitted to your frequency.",
            userId: user._id,
            debug_otp: otp // Uncomment for frontend debugging if needed
        });
    } catch (err) {
        console.error("REGISTRATION ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// RESEND OTP
router.post("/resend-otp", async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "Operative session lost." });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60000);
        await user.save();

        if (email) {
            await sendEmail(
                email,
                "ThreadSense Identity Verification",
                `Your Neural Sync Code is: ${otp}`,
                `<div style="font-family: monospace; background: #000; color: #00f3ff; padding: 20px; border-radius: 10px;">
                    <h2>NEURAL LINK PROTOCOL</h2>
                    <p>Identity verification requested.</p>
                    <h1 style="font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    <p>This frequency expires in 10 minutes.</p>
                 </div>`
            );
        } else {
            console.log(`⚠️ SMS not configured. OTP for ${phone}: ${otp}`);
        }
        console.log(`📡 [RESYNC TRANSMISSION] New OTP for ${user.email || user.phone}: ${otp}`);

        res.json({ message: "New sync code transmitted." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// FORGOT PASSWORD (Step 1: Request OTP)
router.post("/forgot-password", async (req, res) => {
    try {
        const { identifier } = req.body;
        const user = await User.findOne({
            $or: [{ email: identifier }, { phone: identifier }]
        });

        if (!user) return res.status(404).json({ error: "Identity not found in neural archives." });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60000); // 10 mins
        await user.save();

        if (user.email) {
            await sendEmail(
                user.email,
                "ThreadSense Security Recovery",
                `Your Recovery Code is: ${otp}`,
                `<div style="font-family: monospace; background: #000; color: #ff0055; padding: 20px; border-radius: 10px;">
                    <h2>SECURITY ALERT</h2>
                    <p>Password reset requested for your operative account.</p>
                    <h1 style="font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    <p>If this wasn't you, terminate this frequency immediately.</p>
                 </div>`
            );
        }

        console.log(`📡 [RECOVERY TRANSMISSION] OTP for ${identifier}: ${otp}`);

        res.json({ message: "Recovery protocol initiated." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// RESET PASSWORD (Step 2: Verify & Reset)
router.post("/reset-password", async (req, res) => {
    try {
        const { identifier, otp, newPassword } = req.body;
        const user = await User.findOne({
            $or: [{ email: identifier }, { phone: identifier }]
        });

        if (!user) return res.status(404).json({ error: "Identity lost." });
        if (user.otp !== otp) return res.status(400).json({ error: "Invalid neural synchronization code." });
        if (new Date() > user.otpExpires) return res.status(400).json({ error: "Recovery code expired." });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: "Security key successfully updated." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// VERIFY OTP (Step 2: Activate Account)
router.post("/verify-otp", async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ error: "Operative session not found." });
        if (user.otp !== otp) return res.status(400).json({ error: "Invalid neural synchronization code." });
        if (new Date() > user.otpExpires) return res.status(400).json({ error: "OTP frequency expired." });

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        let user;
        if (email) {
            user = await User.findOne({ email });
        } else if (phone) {
            user = await User.findOne({ phone });
        }

        if (!user) return res.status(400).json({ error: "User not found" });

        // Backward compatibility for old users who aren't explicitly marked as unverified
        if (user.isVerified === false) {
            return res.status(403).json({ error: "Identity not verified. Please register again to receive OTP." });
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ error: "Invalid password" });

        const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone
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
