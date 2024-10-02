const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed']
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high']
    },
    dueDate: {
        type: Date
    },
    assignedTo: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    comments: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);