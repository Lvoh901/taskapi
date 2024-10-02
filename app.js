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

const app = express();
require('dotenv').config();

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// cors
app.use(cors());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root route
app.get('/', (req, res) => {
    res.send(
        `
        <html>
            <head>
                <title>Task Management API Documentation</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    h1 { color: #2C3E50; }
                    p { margin: 5px 0; }
                    code { background-color: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
                    a { color: #2980B9; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            
            <body>
                <h1>Task Management API Documentation</h1>
                <p>Welcome to the Task Management API. Below are the available routes:</p>

                <h2>Users</h2>
                <ul>
                    <li><code>POST</code> <a href="/api/users/register" target="_blank">/api/users/register</a> - Register a new user.</li>
                    <li><code>POST</code> <a href="/api/users/login" target="_blank">/api/users/login</a> - Log in a user.</li>
                    <li><code>GET</code> <a href="/api/users/me" target="_blank">/api/users/me</a> - Get the authenticated user profile. (Requires JWT)</li>
                </ul>

                <h2>Tasks</h2>
                <ul>
                    <li><code>POST</code> <a href="/api/tasks" target="_blank">/api/tasks</a> - Create a new task.</li>
                    <li><code>GET</code> <a href="/api/tasks" target="_blank">/api/tasks</a> - Get all tasks for the authenticated user. (Requires JWT)</li>
                    <li><code>PUT</code> <a href="/api/tasks/:id" target="_blank">/api/tasks/:id</a> - Update a task by ID. (Requires JWT)</li>
                    <li><code>DELETE</code> <a href="/api/tasks/:id" target="_blank">/api/tasks/:id</a> - Delete a task by ID. (Requires JWT)</li>
                </ul>

                <h2>Authentication</h2>
                <ul>
                    <li>Authentication for protected routes (like creating tasks, updating tasks, etc.) is handled via JSON Web Tokens (JWT).</li>
                    <li>Send the token in the <code>Authorization</code> header as <code>Bearer TOKEN</code>.</li>
                </ul>

                <p>For more information, refer to the API documentation or contact the developer.</p>
            </body>
        </html>
    `
    );
});

// Routes
app.use('/api', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;