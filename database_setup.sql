-- This creates a new database (like creating a new folder for our data)
-- A database is a container that holds all our tables
CREATE DATABASE book_library;

-- This tells MySQL to use the database we just created
-- All commands after this will apply to the book_library database
USE book_library;

-- This creates a table called 'books' (like creating an Excel spreadsheet)
-- Tables store our actual data in rows and columns
CREATE TABLE books (
    -- id: A unique number for each book (automatically increases: 1, 2, 3...)
    -- AUTO_INCREMENT means MySQL will automatically assign the next number
    -- PRIMARY KEY means this is the main identifier for each row
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- title: The name of the book (up to 255 characters)
    -- VARCHAR(255) means variable character string with max 255 characters
    -- NOT NULL means this field cannot be empty
    title VARCHAR(255) NOT NULL,
    
    -- author: Who wrote the book (required field)
    author VARCHAR(255) NOT NULL,
    
    -- isbn: International Standard Book Number (optional)
    -- UNIQUE means no two books can have the same ISBN
    isbn VARCHAR(20) UNIQUE,
    
    -- genre: Category of the book like Fiction, Science, etc. (optional)
    genre VARCHAR(100),
    
    -- year_published: When the book was published (optional)
    -- INT stores whole numbers
    year_published INT,
    
    -- status: Current reading status with only 3 possible values
    -- ENUM restricts the values to specific options only
    -- DEFAULT 'to-read' means if not specified, it will be 'to-read'
    status ENUM('read', 'reading', 'to-read') DEFAULT 'to-read',
    
    -- rating: User's rating from 1 to 5 stars (optional)
    -- CHECK ensures the value is between 1 and 5
    rating INT CHECK (rating >= 1 AND rating <= 5),
    
    -- notes: Personal notes about the book (optional)
    -- TEXT allows long text content
    notes TEXT,
    
    -- created_at: When this record was added to database
    -- TIMESTAMP stores date and time
    -- DEFAULT CURRENT_TIMESTAMP automatically sets current date/time when record is created
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- updated_at: When this record was last modified
    -- ON UPDATE CURRENT_TIMESTAMP automatically updates when record changes
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Let's add some sample books to start with
-- INSERT INTO adds new rows to our table
INSERT INTO books (title, author, isbn, genre, year_published, status, rating, notes) VALUES
-- First book
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'Fiction', 1925, 'read', 5, 'A classic American novel'),
-- Second book
('1984', 'George Orwell', '9780451524935', 'Dystopian', 1949, 'read', 5, 'Thought-provoking dystopian masterpiece'),
-- Third book
('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 'Fiction', 1960, 'reading', NULL, 'Currently reading');