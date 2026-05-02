const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'svuLibrary.db');
const db = new sqlite3.Database(dbPath);

console.log("Re-initializing database...");

db.serialize(() => {
    // Drop tables to valid schema updates (optional but safe for dev)
    db.run("DROP TABLE IF EXISTS admin");
    db.run("DROP TABLE IF EXISTS students");
    db.run("DROP TABLE IF EXISTS books");
    db.run("DROP TABLE IF EXISTS issued_books");
    db.run("DROP TABLE IF EXISTS queries");

    // 1. Admin Table
    db.run(`CREATE TABLE admin (
    admin_id TEXT PRIMARY KEY,
    password TEXT NOT NULL
  )`);

    // 2. Students Table
    db.run(`CREATE TABLE students (
    student_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    branch TEXT,
    year TEXT,
    password TEXT NOT NULL,
    library_id TEXT UNIQUE,
    no_of_books INTEGER DEFAULT 0
  )`);

    // 3. Books Table
    db.run(`CREATE TABLE books (
    book_id TEXT PRIMARY KEY,
    book_name TEXT NOT NULL,
    author TEXT,
    quantity INTEGER DEFAULT 0
  )`);

    // 4. Issued Books Table
    // Added 'status' column to track 'issued' vs 'returned'
    db.run(`CREATE TABLE issued_books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    book_id TEXT,
    issue_date TEXT,
    return_date TEXT,
    fine INTEGER DEFAULT 0,
    status TEXT DEFAULT 'issued',
    FOREIGN KEY(student_id) REFERENCES students(student_id),
    FOREIGN KEY(book_id) REFERENCES books(book_id)
  )`);

    // 5. Queries Table
    db.run(`CREATE TABLE queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    query_text TEXT,
    FOREIGN KEY(student_id) REFERENCES students(student_id)
  )`);

    // Seed Data: Admin
    const insertAdmin = db.prepare("INSERT INTO admin (admin_id, password) VALUES (?, ?)");
    insertAdmin.run("admin", "admin123");
    insertAdmin.finalize();

    // Seed Data: Sample Books
    const insertBook = db.prepare("INSERT INTO books (book_id, book_name, author, quantity) VALUES (?, ?, ?, ?)");
    insertBook.run("B001", "Introduction to Algorithms", "Cormen", 10);
    insertBook.run("B002", "Clean Code", "Robert C. Martin", 5);
    insertBook.run("B003", "The Pragmatic Programmer", "Andrew Hunt", 7);
    insertBook.finalize();

    // Seed Data: Sample Student
    const insertStudent = db.prepare("INSERT INTO students (student_id, name, branch, year, password, library_id) VALUES (?, ?, ?, ?, ?, ?)");
    insertStudent.run("S001", "John Doe", "CSE", "3", "student123", "LIB1001");
    insertStudent.finalize();

    console.log("Database initialized with tables and seed data.");
});

db.close();
