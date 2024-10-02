// controllers/taskController.js

const Task = require('../models/Task');

// create task
exports.createTask = async (req, res) => {
    const { title, description, status, priority, dueDate, assignedTo, projectId } = req.body;

    try {
        const newTask = new Task({
            title,
            description,
            status,
            priority,
            dueDate,
            assignedTo,
            projectId,
            createdBy: req.user.userId,
        });

        const task = await newTask.save();
        res.status(201).json(task);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// get all tasks with pagination
exports.getTasks = async (req, res) => {
    const { page = 1, limit = 10, status, priority, sortBy, order = 'asc' } = req.query;
    const query = {};

    // Apply filters
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Define sort options
    const sortOptions = {};
    if (sortBy) sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    try {
        const tasks = await Task.find(query)
            .populate('assignedTo', 'username email') // Adjust fields as needed
            .populate('projectId', 'name') // Adjust fields as needed
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Task.countDocuments(query);

        res.json({
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            tasks,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// get task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'username email')
            .populate('projectId', 'name');

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(500).send('Server Error');
    }
};

// update by ID
exports.updateTask = async (req, res) => {
    const { title, description, status, priority, dueDate, assignedTo, projectId } = req.body;

    // Build task object
    const taskFields = {};
    if (title) taskFields.title = title;
    if (description) taskFields.description = description;
    if (status) taskFields.status = status;
    if (priority) taskFields.priority = priority;
    if (dueDate) taskFields.dueDate = dueDate;
    if (assignedTo) taskFields.assignedTo = assignedTo;
    if (projectId) taskFields.projectId = projectId;
    taskFields.updatedAt = Date.now();

    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: taskFields },
            { new: true }
        )
            .populate('assignedTo', 'username email')
            .populate('projectId', 'name');

        res.json(task);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(500).send('Server Error');
    }
};

// delete by ID
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        await task.remove();

        res.json({ msg: 'Task removed' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(500).send('Server Error');
    }
};