const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Import User Controller
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers/userController');

// Import Authentication and Authorization Middleware
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // Create JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '30d', // Token expires in 30 days
        });

        // Respond with token and user info (without password)
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d', // Token expires in 30 days
        });

        // Respond with token and user info (without password)
        res.json({
            message: 'User logged in successfully',
            user: {
                id: user._id,
                name: user.username,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// get all users
router.get('/', auth, admin, getUsers);

// get by ID
router.get('/:id', auth, getUserById);

// update by ID
router.put('/:id', auth, updateUser);

// delete by ID
router.delete('/:id', auth, admin, deleteUser);

module.exports = router;