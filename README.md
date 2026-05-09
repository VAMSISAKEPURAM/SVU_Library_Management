# 📚 SVU Library Management System

A complete, full-stack **Library Management System** built for Sri Venkateswara University (SVU), powered by **HTML**, **CSS**, **JavaScript**, and **SQLite** — with a lightweight **Node.js + Express** backend.

---

## 🗂️ Project Structure  

```
SVU_Library_Management/
│
├── index.html                  # Home / Landing page
├── studentLogin.html           # Student login & registration page
├── adminLogin.html             # Admin login page
│
├── dashboard/
│   ├── studentDashboard.html   # Student portal (profile, books, queries)
│   └── adminDashboard.html     # Admin portal (manage students, books, returns)
│
├── css/
│   └── style.css               # Global styling (CSS variables + Glassmorphism)
│
├── js/
│   ├── app.js                  # General frontend logic
│   └── db.js                   # Frontend API interaction layer
│
├── db/
│   ├── init_db.js              # Database schema creation & seed data script
│   └── svuLibrary.db           # SQLite database file
│
├── images/                     # Static image assets
├── server.js                   # Node.js Express API server
├── package.json                # Project metadata & npm scripts
└── README.md                   # Project documentation
```

---

## ⚙️ Prerequisites

Make sure the following is installed on your machine:

- **[Node.js](https://nodejs.org/)** (v16 or higher recommended)
- **npm** (comes bundled with Node.js)

---

## 🚀 Setup & Run Instructions

### 1. Install Dependencies

Open a terminal in the project root folder and run:

```bash
npm install
```

This installs: `express`, `sqlite3`, `body-parser`, and `cors`.

---

### 2. Initialize the Database *(First-time or Reset)*

> ⚠️ **Warning:** This will **drop and recreate** all tables and seed data. Run this only on first setup or to reset the database.

```bash
npm run init-db
```

This creates the following tables with seed data:
- `admin` — default admin account
- `students` — sample student `S001`
- `books` — 3 sample books (Algorithms, Clean Code, Pragmatic Programmer)
- `issued_books` — tracks book issue & return history
- `queries` — student queries to admin

---

### 3. Start the Server

```bash
npm start
```

Or directly:

```bash
node server.js
```

The server will start on **http://localhost:3000**

---

### 4. Access the Application

Open your browser and go to:

```
http://localhost:3000
```

---

## 🔐 Default Login Credentials

### 👤 Admin Login

| Field      | Value      |
|------------|------------|
| Admin ID   | `admin`    |
| Password   | `admin123` |

### 🎓 Student Login (Sample)

| Field      | Value        |
|------------|--------------|
| Student ID | `S001`       |
| Password   | `student123` |

> You can also **register a new student** from the Student Login page.
>
> When Admin adds a student manually, the default password is auto-generated as: `svu` + `<student_id>` (e.g., `svuS002`)

---

## ✨ Features

### 🎓 Student Portal
- **Register** — Create a new account with auto-generated Library ID (`LIBxxxx`)
- **Login** — Secure student authentication
- **Profile** — View personal details (name, branch, year, Library ID, books held)
- **Issued Books** — View full history of currently issued and previously returned books
- **Submit Query** — Send queries/messages directly to the Admin

### 🛠️ Admin Portal
- **Login** — Secure admin authentication
- **Manage Students** — View all registered students; manually add new students
- **Manage Books** — View all books with availability; add new books to the catalog
- **Issue Book** — Issue a book to a student (auto-sets a 7-day return deadline)
- **Accept Return** — Process book returns with automatic fine calculation (₹10/day overdue)
- **View Queries** — Read all student-submitted queries

---

## 🗄️ Database Schema

The SQLite database (`db/svuLibrary.db`) contains 5 tables:

### `admin`
| Column     | Type | Description       |
|------------|------|-------------------|
| `admin_id` | TEXT | Primary Key       |
| `password` | TEXT | Admin password    |

### `students`
| Column       | Type    | Description                    |
|--------------|---------|--------------------------------|
| `student_id` | TEXT    | Primary Key                    |
| `name`       | TEXT    | Full name                      |
| `branch`     | TEXT    | Academic branch (e.g., CSE)    |
| `year`       | TEXT    | Academic year                  |
| `password`   | TEXT    | Login password                 |
| `library_id` | TEXT    | Unique auto-generated ID       |
| `no_of_books`| INTEGER | Currently issued book count    |

### `books`
| Column      | Type    | Description              |
|-------------|---------|--------------------------|
| `book_id`   | TEXT    | Primary Key              |
| `book_name` | TEXT    | Title of the book        |
| `author`    | TEXT    | Author name              |
| `quantity`  | INTEGER | Available stock count    |

### `issued_books`
| Column        | Type    | Description                      |
|---------------|---------|----------------------------------|
| `id`          | INTEGER | Auto-increment Primary Key       |
| `student_id`  | TEXT    | FK → students                    |
| `book_id`     | TEXT    | FK → books                       |
| `issue_date`  | TEXT    | Date book was issued             |
| `return_date` | TEXT    | Expected/actual return date      |
| `fine`        | INTEGER | Fine in ₹ (₹10 per overdue day)  |
| `status`      | TEXT    | `'issued'` or `'returned'`       |

### `queries`
| Column       | Type    | Description                  |
|--------------|---------|------------------------------|
| `id`         | INTEGER | Auto-increment Primary Key   |
| `student_id` | TEXT    | FK → students                |
| `query_text` | TEXT    | Query message from student   |

---

## 🌐 API Reference

All API routes are served by `server.js` on `http://localhost:3000`.

| Method | Endpoint                     | Description                          |
|--------|------------------------------|--------------------------------------|
| POST   | `/api/admin/login`           | Admin login                          |
| POST   | `/api/student/login`         | Student login                        |
| POST   | `/api/student/register`      | Register a new student               |
| GET    | `/api/student/:id`           | Get student profile details          |
| GET    | `/api/issued_books/:id`      | Get issued/returned books for student|
| POST   | `/api/queries`               | Student submits a query              |
| GET    | `/api/admin/queries`         | Admin views all student queries      |
| GET    | `/api/admin/students`        | Admin views all students             |
| GET    | `/api/admin/books`           | Admin views all books                |
| POST   | `/api/admin/add_book`        | Admin adds a new book                |
| POST   | `/api/admin/add_student`     | Admin adds a new student             |
| POST   | `/api/admin/issue_book`      | Admin issues a book to a student     |
| POST   | `/api/admin/return_book`     | Admin accepts a book return          |

---

## 🧩 Technical Architecture

```
Browser (Frontend)
       │
       │  HTML / CSS / JavaScript
       │  (UI Logic, Validation, Navigation)
       ▼
Node.js Express Server (server.js)
       │
       │  REST API (JSON)
       ▼
SQLite Database (db/svuLibrary.db)
```

- **Frontend** — Pure HTML, CSS (with CSS variables & Glassmorphism), and Vanilla JS handles all UI logic, form validation, and navigation between pages.
- **Backend** — A minimal Node.js Express server acts as a secure database bridge. Browsers cannot write to local files directly, so the server safely reads and writes to the SQLite database.
- **Database** — SQLite provides a lightweight, file-based relational database with no external server needed.

---

## 📦 Dependencies

| Package       | Version   | Purpose                          |
|---------------|-----------|----------------------------------|
| `express`     | ^4.18.2   | Web server & routing             |
| `sqlite3`     | ^5.1.7    | SQLite database driver           |
| `body-parser` | ^1.20.2   | Parse JSON request bodies        |
| `cors`        | ^2.8.5    | Enable Cross-Origin requests     |

---

## 📝 License

This project is built for educational purposes as part of the SVU curriculum.

---

> Built with ❤️ for Sri Venkateswara University
