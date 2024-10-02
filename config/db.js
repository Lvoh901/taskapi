const mongoose = require('mongoose');

// ANSI escape codes for colors
const green = '\u001b[32m'; // Green for success
const red = '\u001b[31m';   // Red for errors
const reset = '\u001b[0m';  // Reset to default color

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Green success messages
        console.log(`${green}✔ MongoDB Connected: ${conn.connection.host}${reset}`);
        console.log(`${green}✔ Connected to Database: ${conn.connection.name}${reset}`); // Log the database name
    } catch (error) {
        // Red error message
        console.error(`${red}✖ Error: ${error.message}${reset}`);
        process.exit(1);
    }
};

module.exports = connectDB;