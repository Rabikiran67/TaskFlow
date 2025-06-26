const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const passport = require('passport');

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

// @route   POST /api/users/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.googleId) { return res.status(400).json({ message: 'Invalid credentials or use Google login.' }); }
        if (!user.password) { return res.status(400).json({ message: 'Please use the password reset functionality.' });}
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(400).json({ message: 'Invalid credentials' }); }
        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) { res.status(500).send('Server error'); }
});

// @route   GET /api/users/auth/google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET /api/users/auth/google/callback
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`, session: false }),
  (req, res) => {
    const payload = { id: req.user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/success?token=${token}`);
  }
);

// @route   GET /api/users/profile
router.get('/profile', auth, async (req, res) => { res.json(req.user); });

// @route   PUT /api/users/profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) { return res.status(404).json({ msg: 'User not found' }); }
        if (name) { user.name = name; }
        await user.save();
        const userProfile = await User.findById(user.id).select('-password');
        res.json(userProfile);
    } catch (err) { res.status(500).send('Server Error'); }
});

// @route   PUT /api/users/password
router.put('/password', auth, async (req, res) => {
    try {
        const { password } = req.body;
        const user = await User.findById(req.user.id);
        if (!user || user.googleId) { return res.status(400).json({ msg: 'Cannot set password for this user.' }); }
        if (password) { user.password = password; }
        else { return res.status(400).json({ msg: 'Password is required.' }); }
        await user.save();
        res.json({ msg: 'Password updated successfully.' });
    } catch (err) { res.status(500).send('Server Error'); }
});

// @route   POST /api/users/forgotpassword
router.post('/forgotpassword', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) { return res.status(200).json({ message: 'Email sent' }); }
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/resetpassword/${resetToken}`;
        const message = `Click this link to reset your password: \n\n ${resetUrl}`;
        await sendEmail({ email: user.email, subject: 'Password Reset Request', message });
        res.status(200).json({ message: 'Email sent' });
    } catch (err) { res.status(500).send('Email could not be sent'); }
});

// @route   PUT /api/users/resetpassword/:resettoken
router.put('/resetpassword/:resettoken', async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) { return res.status(400).json({ message: 'Invalid or expired token' }); }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;