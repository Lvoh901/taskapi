// routes/taskRoutes.js

const express = require('express');
const router = express.Router();

// Import Task Controller
const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');

// Import Authentication Middleware
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createTask);
router.get('/', auth, getTasks);
router.get('/:id', auth, getTaskById);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

module.exports = router;