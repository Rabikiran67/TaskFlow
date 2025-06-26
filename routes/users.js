const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const passport = require('passport');
const { URL } = require('url');

// --- HARDCODED URL FOR DEBUGGING ---
const FRONTEND_BASE_URL = 'https://task-flow-nine-inky.vercel.app';

// @route   POST /api/users/register
router.post('/register', async (req, res) => { /* ... your register code ... */ });

// @route   POST /api/users/login
router.post('/login', async (req, res) => { /* ... your login code ... */ });

// @route   GET /api/users/auth/google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET /api/users/auth/google/callback
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: new URL('/login', FRONTEND_BASE_URL).toString(),
    session: false
  }),
  (req, res) => {
    const payload = { id: req.user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const redirectUrl = new URL('/auth/success', FRONTEND_BASE_URL);
    redirectUrl.searchParams.set('token', token);
    res.redirect(redirectUrl.toString());
  }
);

// @route   POST /api/users/forgotpassword
router.post('/forgotpassword', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) { return res.status(200).json({ message: 'If an account exists, email sent.' }); }
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });
        const resetUrl = new URL(`/resetpassword/${resetToken}`, FRONTEND_BASE_URL).toString();
        const message = `Click this link to reset your password: \n\n ${resetUrl}`;
        await sendEmail({ email: user.email, subject: 'Password Reset Request', message });
        res.status(200).json({ message: 'If an account exists, email sent.' });
    } catch (err) {
        // ... error handling
    }
});

// ... All other routes (profile, password, resetpassword/:resettoken) remain the same ...
// They do not use the FRONTEND_BASE_URL so they are not the source of the error.

module.exports = router;