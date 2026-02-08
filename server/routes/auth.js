import express from 'express';
// import passport from 'passport'; // Passport not installed/configured yet
import { logError, logInfo } from '../utils/logger.js';

const router = express.Router();

// Google authentication route
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google authentication callback
/*
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
        if (err) {
            logError(`Authentication error: ${err}`);
            return res.status(500).json({ message: 'Authentication failed', error: err.message });
        }
        if (!user) {
            logInfo('No user found during Google authentication');
            return res.status(404).json({ message: 'User not found', info });
        }
        req.logIn(user, (err) => {
            if (err) {
                logError(`Login error: ${err}`);
                return res.status(500).json({ message: 'Login failed', error: err.message });
            }
            logInfo('User authenticated successfully');
            return res.status(200).json({ message: 'Login successful', user });
        });
    })(req, res, next);
});
*/

// Placeholder for future auth implementation
router.get('/', (req, res) => {
    res.json({ message: "Auth route active. Google Auth not yet configured." });
});

export default router;
