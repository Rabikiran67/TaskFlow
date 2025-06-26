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

const FRONTEND_BASE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// @route   POST /api/users/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) { return res.status(400).json({ message: 'User already exists' }); }
        user = new User({ name, email, password });
        await user.save();
        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
    } catch (error) { res.status(500).send('Server error'); }
});

// --- THIS IS THE CORRECTED LOGIN ROUTE ---
// @route   POST /api/users/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Find the user by their email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 2. Check if this is a Google-only account (has googleId but no password)
        if (user.googleId && !user.password) {
            return res.status(400).json({ message: 'This account was created with Google. Please use "Continue with Google".' });
        }

        // 3. If it's a regular account, compare the provided password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 4. If password matches, create and send token
        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});
// --- END OF CORRECTION ---

// ... All other routes (Google OAuth, Profile, Password Management) remain the same ...
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: new URL('/login', FRONTEND_BASE_URL).toString(), session: false }),
  (req, res) => {
    const payload = { id: req.user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const redirectUrl = new URL('/auth/success', FRONTEND_BASE_URL);
    redirectUrl.searchParams.set('token', token);
    res.redirect(redirectUrl.toString());
  }
);
router.get('/profile', auth, async (req, res) => { res.json(req.user); });
router.put('/profile', auth, async (req, res) => { /* ... */ });
router.put('/password', auth, async (req, res) => { /* ... */ });
router.post('/forgotpassword', async (req, res) => { /* ... */ });
router.put('/resetpassword/:resettoken', async (req, res) => { /* ... */ });


module.exports = router;