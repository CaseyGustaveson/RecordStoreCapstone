// server.js
import express from 'express';
import dotenv from 'dotenv';
import { authRouter } from './src/api/auth.js'; // Import the authRouter from auth.js

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Use the authRouter for authentication-related routes
app.use('/api/auth', authRouter);

// Default route
app.get('/', (req, res) => {
    res.send('Hello friend!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
