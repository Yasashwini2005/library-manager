// Import Express to create a router
const express = require('express');

// Create a router instance - this is like a mini-app for book routes
const router = express.Router();

// Import our database connection
const db = require('../config/database');

// ============================================
// GET ALL BOOKS
// ============================================
// When someone visits /api/books (GET request)
router.get('/', async (req, res) => {
    try {
        // Execute SQL query to get all books
        // [rows] destructures the result - we only want the first element (the data rows)
        // ORDER BY created_at DESC shows newest books first
        const [rows] = await db.query(
            'SELECT * FROM books ORDER BY created_at DESC'
        );
        
        // Send the books data back as JSON
        res.json(rows);
        
    } catch (error) {
        // If something goes wrong, send error status 500 (server error)
        res.status(500).json({ 
            error: error.message 
        });
    }
});

// ============================================
// GET SINGLE BOOK BY ID
// ============================================
// :id is a URL parameter - it captures the value in the URL
// For example: /api/books/5 would make req.params.id = 5
router.get('/:id', async (req, res) => {
    try {
        // Query database for specific book
        // The ? is a placeholder that gets replaced with req.params.id
        // This prevents SQL injection attacks
        const [rows] = await db.query(
            'SELECT * FROM books WHERE id = ?', 
            [req.params.id]  // This array contains values for the placeholders
        );
        
        // Check if book was found
        if (rows.length === 0) {
            // Send 404 status (Not Found) if book doesn't exist
            return res.status(404).json({ 
                error: 'Book not found' 
            });
        }
        
        // Send the first (and only) book in the result
        res.json(rows[0]);
        
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
});

// ============================================
// CREATE NEW BOOK (POST)
// ============================================
router.post('/', async (req, res) => {
    try {
        // Extract data from request body (what the user submitted)
        // Destructuring assignment - pulls out specific properties
        const { 
            title, 
            author, 
            isbn, 
            genre, 
            year_published, 
            status, 
            rating, 
            notes 
        } = req.body;
        
        // VALIDATION - Check required fields
        if (!title || !author) {
            // Send 400 status (Bad Request) if missing required data
            return res.status(400).json({ 
                error: 'Title and author are required' 
            });
        }
        
        // Insert new book into database
        const [result] = await db.query(
            // The INSERT SQL command with placeholders for safety
            `INSERT INTO books 
            (title, author, isbn, genre, year_published, status, rating, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            // Array of values to replace the ? placeholders
            [title, author, isbn, genre, year_published, status, rating, notes]
        );
        
        // Get the newly created book using its ID
        // result.insertId is the ID of the row we just inserted
        const [newBook] = await db.query(
            'SELECT * FROM books WHERE id = ?', 
            [result.insertId]
        );
        
        // Send back the new book with 201 status (Created)
        res.status(201).json(newBook[0]);
        
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
});

// ============================================
// UPDATE BOOK (PUT)
// ============================================
router.put('/:id', async (req, res) => {
    try {
        // Extract updated data from request body
        const { 
            title, 
            author, 
            isbn, 
            genre, 
            year_published, 
            status, 
            rating, 
            notes 
        } = req.body;
        
        // Update the book in database
        const [result] = await db.query(
            // UPDATE command with SET clause for each field
            `UPDATE books 
            SET title = ?, 
                author = ?, 
                isbn = ?, 
                genre = ?, 
                year_published = ?, 
                status = ?, 
                rating = ?, 
                notes = ? 
            WHERE id = ?`,
            // Values including the ID from URL parameters
            [title, author, isbn, genre, year_published, status, rating, notes, req.params.id]
        );
        
        // Check if any rows were actually updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Book not found' 
            });
        }
        
        // Get the updated book data
        const [updatedBook] = await db.query(
            'SELECT * FROM books WHERE id = ?', 
            [req.params.id]
        );
        
        // Send back the updated book
        res.json(updatedBook[0]);
        
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
});

// ============================================
// DELETE BOOK
// ============================================
router.delete('/:id', async (req, res) => {
    try {
        // Delete the book from database
        const [result] = await db.query(
            'DELETE FROM books WHERE id = ?', 
            [req.params.id]
        );
        
        // Check if any rows were deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Book not found' 
            });
        }
        
        // Send success message
        res.json({ 
            message: 'Book deleted successfully' 
        });
        
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
});

// ============================================
// GET STATISTICS
// ============================================
router.get('/stats/overview', async (req, res) => {
    try {
        // Run a complex query to get statistics
        const [stats] = await db.query(`
            SELECT 
                -- COUNT(*) counts all rows
                COUNT(*) as total_books,
                
                -- COUNT with CASE only counts rows that match condition
                COUNT(CASE WHEN status = 'read' THEN 1 END) as books_read,
                COUNT(CASE WHEN status = 'reading' THEN 1 END) as books_reading,
                COUNT(CASE WHEN status = 'to-read' THEN 1 END) as books_to_read,
                
                -- AVG calculates average of all non-null ratings
                AVG(rating) as average_rating
            FROM books
        `);
        
        // Send statistics
        res.json(stats[0]);
        
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
});

// Export the router so server.js can use it
module.exports = router;