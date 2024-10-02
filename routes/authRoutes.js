// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const Joi = require('joi');
const validate = require('../middleware/validate');

// Validation schemas
const registerSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'user'),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// @route   POST /api/register
router.post('/register', validate(registerSchema), register);

// @route   POST /api/login
router.post('/login', validate(loginSchema), login);

module.exports = router;