// controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');

// get users [Admin only]
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password field
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// get by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if the requester is the user themselves or an admin
        if (req.user.role !== 'admin' && req.user.userId !== user.id) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        res.json(user);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
};

// update user
exports.updateUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    // Build user object
    const userFields = {};
    if (username) userFields.username = username;
    if (email) userFields.email = email;
    if (role && req.user.role === 'admin') userFields.role = role; // Only admin can update role

    if (password) {
        const salt = await bcrypt.genSalt(10);
        userFields.password = await bcrypt.hash(password, salt);
    }

    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if the requester is the user themselves or an admin
        if (req.user.role !== 'admin' && req.user.userId !== user.id) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: userFields },
            { new: true }
        ).select('-password'); // Exclude password

        res.json(user);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
};

// delete by ID
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await user.remove();

        res.json({ msg: 'User removed' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
};