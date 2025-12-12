# Personal Book Library Manager

A full-stack web app to track your reading list. Add books, rate them, track what you're reading, and search through your collection.

## What It Does

- Add books with details like title, author, ISBN, genre, publication year
- Track reading status (to-read, reading, finished)
- Rate books out of 5 stars
- Add personal notes about each book
- Search by title or author
- Filter by reading status
- Dashboard showing your reading stats
- Edit or delete books

## Tech Stack

**Frontend:**
- Plain HTML, CSS, JavaScript
- Font Awesome icons
- Responsive grid layout

**Backend:**
- Node.js + Express
- MySQL database
- RESTful API

## Project Structure

```
book-library-manager/
├── config/
│   └── database.js          # MySQL connection setup
├── routes/
│   └── books.js             # API endpoints for CRUD operations
├── css/
│   └── style.css           # All the styling
├── js/
│   └── script.js           # Frontend logic and API calls
├── index.html              # Main page
├── server.js               # Express server
├── database_setup.sql      # Database schema and sample data
└── .env                    # Database credentials (not in repo)
```

## Getting Started

### You'll Need
- Node.js installed
- MySQL running locally

### Setup

1. Clone this repo:
```bash
git clone https://github.com/yourusername/book-library-manager.git
cd book-library-manager
```

2. Install dependencies:
```bash
npm install express mysql2 cors dotenv
```

3. Set up the database:
- Open MySQL client
- Run the SQL commands from `database_setup.sql`

4. Create `.env` file in the root directory:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=book_library
PORT=3000
```

5. Start the backend:
```bash
node server.js
```

6. Open `index.html` in your browser

The app should now be running. Backend on `http://localhost:3000`, frontend wherever you opened the HTML file.

## API Endpoints

- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get specific book
- `POST /api/books` - Add new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/books/stats/overview` - Get reading statistics

## Features in Detail

**Add Book Form**
- Title and author are required
- Everything else is optional
- Status defaults to "To Read"

**Search & Filter**
- Real-time search as you type
- Search works on both title and author
- Filter dropdown for reading status

**Book Cards**
- Color-coded status badges
- Star ratings
- Edit and delete buttons
- Display all book info

**Statistics Dashboard**
- Total books in library
- Books read
- Currently reading
- Books to read

## Things I Might Add Later

- User authentication
- Book cover images
- Export to CSV
- Reading goals and progress
- Genre analytics
- Sort options
- Pagination for large collections

## Known Issues

- No image upload yet (planning to add this)
- Search only works on title/author (could expand to genre, notes)
- Deletes are permanent (should add confirmation or trash)

## License

Do whatever you want with this code. It's a learning project.

## Questions?

Open an issue or reach out. Always happy to help if you're learning too.
