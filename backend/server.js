// Import dependencies
const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/books');
require('dotenv').config();

// Create Express app
const app = express();

// Port
const PORT = process.env.PORT || 3000;

// Middleware - ORDER MATTERS!
// CORS must come first
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// Body parsers must come before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/books', bookRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Backend is running. Use /api/books or /api/health");
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK',
        message: 'Book Library API is running'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});