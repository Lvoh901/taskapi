const Project = require('../models/Project');

// create a new project
exports.createProject = async (req, res) => {
    const { name, description, members } = req.body;

    try {
        const newProject = new Project({
            name,
            description,
            members,
            createdBy: req.user.id, // Changed from req.user.userId to req.user.id
        });

        const project = await newProject.save();
        res.status(201).json(project);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// get all projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate('members', 'username email')
            .populate('createdBy', 'username email');

        res.json(projects);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// get by ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('members', 'username email')
            .populate('createdBy', 'username email');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// update a project by ID
exports.updateProject = async (req, res) => {
    const { name, description, members } = req.body;

    // Build project object
    const projectFields = {};
    if (name) projectFields.name = name;
    if (description) projectFields.description = description;
    if (members) projectFields.members = members;

    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: projectFields },
            { new: true }
        )
            .populate('members', 'username email')
            .populate('createdBy', 'username email');

        res.json(project);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// delete a project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await Project.findByIdAndDelete(req.params.id);

        res.json({ message: 'Project removed' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};