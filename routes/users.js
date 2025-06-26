const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const passport = require('passport');

// --- LOCAL AUTHENTICATION ---

// @route   POST /api/users/register
// @desc    Register a new local user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    user = new User({ name, email, password });
    await user.save();
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/users/login
// @desc    Authenticate local user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Cannot log in with password if it's a Google account
    if (user.googleId) {
        return res.status(400).json({ message: 'This account was registered with Google. Please use "Continue with Google".' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});


// --- GOOGLE OAUTH ---

// @route   GET /api/users/auth/google
// @desc    Initiate authentication with Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET /api/users/auth/google/callback
// @desc    Google OAuth callback URL
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login',
    session: false,
  }),
  (req, res) => {
    const payload = { id: req.user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:5173/auth/success?token=${token}`);
  }
);


// --- USER PROFILE MANAGEMENT ---

// @route   GET /api/users/profile
// @desc    Get current user's profile
router.get('/profile', auth, async (req, res) => {
  try {
    // req.user is attached from the auth middleware
    res.json(req.user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile details (name)
router.put('/profile', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (name) {
      user.name = name;
    }
    await user.save();
    // Return only safe fields
    const userProfile = await User.findById(user.id).select('-password');
    res.json(userProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// --- PASSWORD MANAGEMENT ---

// @route   POST /api/users/forgotpassword
// @desc    Send email to reset password
router.post('/forgotpassword', async (req, res) => { /* ... (your existing forgot password code) ... */ });

// @route   PUT /api/users/resetpassword/:resettoken
// @desc    Reset password using token
router.put('/resetpassword/:resettoken', async (req, res) => { /* ... (your existing reset password code) ... */ });

// @route   PUT /api/users/password
// @desc    Update password for an authenticated local user
router.put('/password', auth, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (user.googleId) {
      return res.status(400).json({ msg: 'Cannot set password for Google-authenticated users.' });
    }
    if (password) {
      user.password = password;
    } else {
      return res.status(400).json({ msg: 'Password is required.' });
    }
    await user.save();
    res.json({ msg: 'Password updated successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;