'use strict';

const express = require('express');
const passport = require('passport');
const router = express.Router();
const { logError, logInfo } = require('../utils/logger');

// Google authentication route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google authentication callback
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

module.exports = router;
