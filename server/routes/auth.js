import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logError, logInfo } from '../utils/logger.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
router.post('/google', async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ error: "Missing idToken" });
        }

        // Verify Google Token
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID, 
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Find or Create User
        let user = await User.findOne({ email });

        if (user) {
            // Update existing user with googleId if missing
            if (!user.googleId) {
                user.googleId = googleId;
                if (picture && !user.avatar) user.avatar = picture;
                await user.save();
            }
        } else {
            // Create new user
            user = new User({
                username: name || email.split('@')[0],
                email,
                googleId,
                avatar: picture,
                role: 'member'
            });
            await user.save();
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });

    } catch (error) {
        logError(`Google Auth Error: ${error.message}`);
        res.status(500).json({ error: "Google authentication failed" });
    }
});

// Placeholder for future auth implementation
router.get('/', (req, res) => {
    res.json({ message: "Auth route active. Google Auth not yet configured." });
});

export default router;
