// app.js
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');
const cors = require('cors');
const path = require('path');

const app = express();
require('dotenv').config();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes
app.use('/api', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

// Sample route to add a task (for demonstration purposes)
app.post('/add-task', (req, res) => {
    const { title, description } = req.body;
    // Here you would typically save the task to the database
    res.json({ message: 'Task added successfully', task: { title, description } });
});

// Sample route to add a project (for demonstration purposes)
app.post('/add-project', (req, res) => {
    const { name, description } = req.body;
    // Here you would typically save the project to the database
    res.json({ message: 'Project added successfully', project: { name, description } });
});

// Sample route to register a user (for demonstration purposes)
app.post('/register-user', (req, res) => {
    const { username, email, password } = req.body;
    // Here you would typically save the user to the database
    res.json({ message: 'User registered successfully', user: { username, email } });
});

// Error Handler
app.use(errorHandler);

module.exports = app;