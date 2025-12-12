// ============================================
// BOOK LIBRARY MANAGER - JAVASCRIPT
// ============================================

// API Configuration
// This is the base URL for all our API requests
// Change this if your backend runs on a different port
const API_URL = 'http://localhost:3000/api';
// ============================================
// DOM ELEMENT REFERENCES
// ============================================
// Get references to HTML elements we'll need to interact with
// document.getElementById() finds an element by its ID attribute

const bookForm = document.getElementById('bookForm');           // Add book form
const booksList = document.getElementById('booksList');         // Container for book cards
const searchInput = document.getElementById('searchInput');     // Search text input
const filterStatus = document.getElementById('filterStatus');   // Status filter dropdown
const editModal = document.getElementById('editModal');         // Edit popup modal
const editBookForm = document.getElementById('editBookForm');   // Edit form inside modal
const closeModal = document.getElementsByClassName('close')[0]; // X button to close modal

// ============================================
// APPLICATION STATE
// ============================================
// These arrays store our data in memory

let books = [];           // All books from database
let filteredBooks = [];   // Books after search/filter applied

// ============================================
// INITIALIZATION
// ============================================
// DOMContentLoaded event fires when HTML is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // These functions run when page loads
    loadBooks();          // Get all books from server
    loadStatistics();     // Get statistics from server
    setupEventListeners(); // Set up button clicks, form submissions, etc.
});

// ============================================
// EVENT LISTENERS SETUP
// ============================================
function setupEventListeners() {
    // When add book form is submitted
    bookForm.addEventListener('submit', handleAddBook);
    
    // When edit book form is submitted
    editBookForm.addEventListener('submit', handleEditBook);
    
    // When user types in search box
    searchInput.addEventListener('input', handleSearch);
    
    // When user changes filter dropdown
    filterStatus.addEventListener('change', handleFilter);
    
    // When X button is clicked on modal
    closeModal.addEventListener('click', () => {
        editModal.style.display = 'none';  // Hide the modal
    });
    
    // When user clicks outside the modal content
    window.addEventListener('click', (e) => {
        // If the click target is the modal background
        if (e.target === editModal) {
            editModal.style.display = 'none';  // Hide the modal
        }
    });
}

// ============================================
// LOAD BOOKS FROM SERVER
// ============================================
async function loadBooks() {
    try {
        // Show loading spinner while fetching
        showLoading();
        
        // Fetch makes HTTP request to our API
        // await pauses execution until promise resolves
        const response = await fetch(`${API_URL}/books`);
        
        // Convert response to JSON format
        books = await response.json();
        
        // Initially, filtered books = all books
        filteredBooks = [...books];  // ... is spread operator (creates copy)
        
        // Display the books on the page
        renderBooks();
        
    } catch (error) {
        // If something goes wrong, log it and show error
        console.error('Error loading books:', error);
        showError('Failed to load books');
    }
}

// ============================================
// LOAD STATISTICS FROM SERVER
// ============================================
async function loadStatistics() {
    try {
        // Fetch statistics from API
        const response = await fetch(`${API_URL}/books/stats/overview`);
        const stats = await response.json();
        
        // Update the statistics cards with new numbers
        // textContent sets the text inside an element
        document.getElementById('totalBooks').textContent = stats.total_books || 0;
        document.getElementById('booksRead').textContent = stats.books_read || 0;
        document.getElementById('booksReading').textContent = stats.books_reading || 0;
        document.getElementById('booksToRead').textContent = stats.books_to_read || 0;
        
    } catch (error) {
        console.error('Error loading statistics:', error);
        // Don't show error to user - statistics are not critical
    }
}

// ============================================
// RENDER BOOKS TO PAGE
// ============================================
function renderBooks() {
    // Check if there are no books to display
    if (filteredBooks.length === 0) {
        // Show empty state message
        booksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book"></i>
                <h3>No books found</h3>
                <p>Add your first book to get started!</p>
            </div>
        `;
        return;  // Exit function early
    }

    // Create HTML for each book using map()
    // map() transforms each book object into HTML string
    booksList.innerHTML = filteredBooks.map(book => `
        <div class="book-card">
            <!-- Book title (escaped for security) -->
            <h3>${escapeHtml(book.title)}</h3>
            
            <!-- Author name -->
            <p class="author">by ${escapeHtml(book.author)}</p>
            
            <!-- Book metadata (genre, year, ISBN) -->
            <div class="metadata">
                <!-- Only show genre if it exists -->
                ${book.genre ? `<span><i class="fas fa-tag"></i> ${escapeHtml(book.genre)}</span>` : ''}
                
                <!-- Only show year if it exists -->
                ${book.year_published ? `<span><i class="fas fa-calendar"></i> ${book.year_published}</span>` : ''}
                
                <!-- Only show ISBN if it exists -->
                ${book.isbn ? `<span><i class="fas fa-barcode"></i> ${escapeHtml(book.isbn)}</span>` : ''}
            </div>
            
            <!-- Status badge and rating -->
            <div>
                <!-- Reading status with color coding -->
                <span class="status-badge status-${book.status}">
                    ${formatStatus(book.status)}
                </span>
                
                <!-- Show star rating if exists -->
                ${book.rating ? `<span class="rating">${generateStars(book.rating)}</span>` : ''}
            </div>
            
            <!-- Notes if they exist -->
            ${book.notes ? `<p class="notes">${escapeHtml(book.notes)}</p>` : ''}
            
            <!-- Action buttons -->
            <div class="book-actions">
                <!-- Edit button with onclick handler -->
                <button class="btn btn-edit" onclick="openEditModal(${book.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                
                <!-- Delete button with onclick handler -->
                <button class="btn btn-delete" onclick="deleteBook(${book.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');  // join() combines array of strings into one string
}

// ============================================
// HANDLE ADD BOOK FORM SUBMISSION
// ============================================
async function handleAddBook(e) {
    // Prevent default form submission (page refresh)
    e.preventDefault();
    
    // Get form data using FormData API
    const formData = new FormData(bookForm);
    
    // Convert FormData to regular object
    // Object.fromEntries() converts key-value pairs to object
    const bookData = Object.fromEntries(formData.entries());
    
    // Clean up empty fields (convert empty strings to null)
    Object.keys(bookData).forEach(key => {
        if (bookData[key] === '') {
            bookData[key] = null;
        }
    });
    
    try {
        // Send POST request to create new book
        const response = await fetch(`${API_URL}/books`, {
            method: 'POST',                          // HTTP method
            headers: {
                'Content-Type': 'application/json'   // Tell server we're sending JSON
            },
            body: JSON.stringify(bookData)           // Convert object to JSON string
        });
        
        // Check if request was successful
        if (!response.ok) {
            throw new Error('Failed to add book');
        }
        
        // Reload books and statistics
        await loadBooks();
        await loadStatistics();
        
        // Clear the form
        bookForm.reset();
        
        // Show success message
        showSuccess('Book added successfully!');
        
    } catch (error) {
        console.error('Error adding book:', error);
        showError('Failed to add book');
    }
}

// ============================================
// OPEN EDIT MODAL WITH BOOK DATA
// ============================================
async function openEditModal(bookId) {
    // Find the book in our local array
    // find() returns first element that matches condition
    const book = books.find(b => b.id === bookId);
    
    // If book not found, exit
    if (!book) return;
    
    // Fill the edit form with current book data
    // || '' provides empty string as fallback if value is null/undefined
    document.getElementById('editBookId').value = book.id;
    document.getElementById('editTitle').value = book.title || '';
    document.getElementById('editAuthor').value = book.author || '';
    document.getElementById('editIsbn').value = book.isbn || '';
    document.getElementById('editGenre').value = book.genre || '';
    document.getElementById('editYear').value = book.year_published || '';
    document.getElementById('editStatus').value = book.status || 'to-read';
    document.getElementById('editRating').value = book.rating || '';
    document.getElementById('editNotes').value = book.notes || '';
    
    // Show the modal
    editModal.style.display = 'block';
}

// ============================================
// HANDLE EDIT BOOK FORM SUBMISSION
// ============================================
async function handleEditBook(e) {
    // Prevent default form submission
    e.preventDefault();
    
    // Get the book ID from hidden field
    const bookId = document.getElementById('editBookId').value;
    
    // Gather updated book data from form
    const bookData = {
        title: document.getElementById('editTitle').value,
        author: document.getElementById('editAuthor').value,
        isbn: document.getElementById('editIsbn').value || null,
        genre: document.getElementById('editGenre').value || null,
        year_published: document.getElementById('editYear').value || null,
        status: document.getElementById('editStatus').value,
        rating: document.getElementById('editRating').value || null,
        notes: document.getElementById('editNotes').value || null
    };
    
    try {
        // Send PUT request to update book
        const response = await fetch(`${API_URL}/books/${bookId}`, {
            method: 'PUT',                           // PUT method for updates
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });
        
        // Check if request was successful
        if (!response.ok) {
            throw new Error('Failed to update book');
        }
        
        // Reload books and statistics
        await loadBooks();
        await loadStatistics();
        
        // Hide the modal
        editModal.style.display = 'none';
        
        // Show success message
        showSuccess('Book updated successfully!');
        
    } catch (error) {
        console.error('Error updating book:', error);
        showError('Failed to update book');
    }
}

// ============================================
// DELETE BOOK
// ============================================
async function deleteBook(bookId) {
    // Show confirmation dialog
    // confirm() returns true if user clicks OK, false if Cancel
    if (!confirm('Are you sure you want to delete this book?')) {
        return;  // Exit if user cancels
    }
    
    try {
        // Send DELETE request
        const response = await fetch(`${API_URL}/books/${bookId}`, {
            method: 'DELETE'  // DELETE method for removing resources
        });
        
        // Check if request was successful
        if (!response.ok) {
            throw new Error('Failed to delete book');
        }
        
        // Reload books and statistics
        await loadBooks();
        await loadStatistics();
        
        // Show success message
        showSuccess('Book deleted successfully!');
        
    } catch (error) {
        console.error('Error deleting book:', error);
        showError('Failed to delete book');
    }
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
function handleSearch() {
    // Get search term and convert to lowercase for case-insensitive search
    const searchTerm = searchInput.value.toLowerCase();
    
    // Filter books array based on search term
    // filter() creates new array with elements that pass the test
    filteredBooks = books.filter(book => 
        // Check if title OR author contains search term
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm)
    );
    
    // Apply status filter on top of search
    applyStatusFilter();
    
    // Re-render the book list
    renderBooks();
}

// ============================================
// FILTER BY STATUS
// ============================================
function handleFilter() {
    // Apply the status filter
    applyStatusFilter();
    
    // Re-render the book list
    renderBooks();
}

// ============================================
// APPLY STATUS FILTER
// ============================================
function applyStatusFilter() {
    // Get selected status value
    const statusValue = filterStatus.value;
    
    // If a status is selected (not empty string)
    if (statusValue) {
        // Further filter the already filtered books
        filteredBooks = filteredBooks.filter(book => book.status === statusValue);
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Escape HTML to prevent XSS attacks
// XSS = Cross-Site Scripting (security vulnerability)
function escapeHtml(text) {
    // Return empty string if text is null/undefined
    if (!text) return '';
    
    // Map of characters to escape
    const map = {
        '&': '&amp;',     // Ampersand
        '<': '&lt;',      // Less than
        '>': '&gt;',      // Greater than
        '"': '&quot;',    // Double quote
        "'": '&#039;'     // Single quote
    };
    
    // Replace dangerous characters with safe HTML entities
    // Regular expression /[&<>"']/g finds all occurrences
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Format status for display
function formatStatus(status) {
    // Map internal values to user-friendly text
    const statusMap = {
        'read': 'Read',
        'reading': 'Currently Reading',
        'to-read': 'To Read'
    };
    
    // Return formatted status or original if not found
    return statusMap[status] || status;
}

// Generate star icons for rating
function generateStars(rating) {
    let stars = '';
    
    // Loop from 1 to 5
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            // Filled star for ratings
            stars += '<i class="fas fa-star"></i>';
        } else {
            // Empty star for remaining
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// Show loading spinner
function showLoading() {
    // Replace books list content with spinner
    booksList.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
}

// Show success message
function showSuccess(message) {
    // For now, using alert
    // TODO: Implement toast notification
    alert(message);
}

// Show error message
function showError(message) {
    // For now, using alert
    // TODO: Implement toast notification
    alert(message);
}