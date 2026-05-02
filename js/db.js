
const DB_KEYS = {
    STUDENTS: 'svu_students',
    BOOKS: 'svu_books',
    ISSUED_BOOKS: 'svu_issued_books',
    QUERIES: 'svu_queries',
    ADMIN: 'svu_admin' // We'll just hardcode admin for now or store it
};

const SEED_BOOKS = [
    { book_id: 'B001', book_name: 'Introduction to Algorithms', author: 'Cormen', quantity: 5 },
    { book_id: 'B002', book_name: 'Clean Code', author: 'Robert C. Martin', quantity: 3 },
    { book_id: 'B003', book_name: 'JavaScript: The Good Parts', author: 'Douglas Crockford', quantity: 4 },
    { book_id: 'B004', book_name: 'Design Patterns', author: 'Erich Gamma', quantity: 2 }
];

const db = {
    init: function () {
        if (!localStorage.getItem(DB_KEYS.BOOKS)) {
            localStorage.setItem(DB_KEYS.BOOKS, JSON.stringify(SEED_BOOKS));
        }
        if (!localStorage.getItem(DB_KEYS.STUDENTS)) {
            localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify([]));
        }
        if (!localStorage.getItem(DB_KEYS.ISSUED_BOOKS)) {
            localStorage.setItem(DB_KEYS.ISSUED_BOOKS, JSON.stringify([]));
        }
        if (!localStorage.getItem(DB_KEYS.QUERIES)) {
            localStorage.setItem(DB_KEYS.QUERIES, JSON.stringify([]));
        }
    },

    // --- ADMIN ---
    loginAdmin: async function (admin_id, password) {
        // Hardcoded admin for simplicity
        if (admin_id === 'admin' && password === 'admin') {
            return { success: true, admin: { admin_id: 'admin', name: 'Administrator' } };
        }
        return { success: false, message: "Invalid Admin ID or Password" };
    },

    // --- STUDENTS ---
    loginStudent: async function (student_id, password) {
        const students = JSON.parse(localStorage.getItem(DB_KEYS.STUDENTS));
        const student = students.find(s => s.student_id === student_id && s.password === password);
        if (student) {
            return { success: true, student: student };
        }
        return { success: false, message: "Invalid Student ID or Password" };
    },

    registerStudent: async function (studentData) {
        const students = JSON.parse(localStorage.getItem(DB_KEYS.STUDENTS));

        if (students.some(s => s.student_id === studentData.student_id)) {
            return { success: false, message: "Student ID already registered." };
        }

        const library_id = "LIB" + Math.floor(1000 + Math.random() * 9000);
        const newStudent = { ...studentData, library_id, no_of_books: 0 };

        students.push(newStudent);
        localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(students));

        return { success: true, library_id: library_id, message: "Registration Successful! Library ID: " + library_id };
    },

    getStudent: async function (id) {
        const students = JSON.parse(localStorage.getItem(DB_KEYS.STUDENTS));
        return students.find(s => s.student_id === id);
    },

    getAllStudents: async function () {
        return JSON.parse(localStorage.getItem(DB_KEYS.STUDENTS));
    },

    // --- BOOKS ---
    getBooks: async function () {
        return JSON.parse(localStorage.getItem(DB_KEYS.BOOKS));
    },

    addBook: async function (bookData) {
        const books = JSON.parse(localStorage.getItem(DB_KEYS.BOOKS));
        if (books.some(b => b.book_id === bookData.book_id)) {
            return { success: false, message: "Book ID already exists." };
        }
        books.push(bookData);
        localStorage.setItem(DB_KEYS.BOOKS, JSON.stringify(books));
        return { success: true, message: "Book added successfully!" };
    },

    // --- ISSUING ---
    issueBook: async function (student_id, book_id, issue_date) {
        const books = JSON.parse(localStorage.getItem(DB_KEYS.BOOKS));
        const students = JSON.parse(localStorage.getItem(DB_KEYS.STUDENTS));
        let issued = JSON.parse(localStorage.getItem(DB_KEYS.ISSUED_BOOKS));

        const bookIdx = books.findIndex(b => b.book_id === book_id);
        const studentIdx = students.findIndex(s => s.student_id === student_id);

        if (bookIdx === -1) return { success: false, message: "Book not found." };
        if (books[bookIdx].quantity <= 0) return { success: false, message: "Book out of stock." };
        if (studentIdx === -1) return { success: false, message: "Student not found." };

        const dateObj = new Date(issue_date);
        dateObj.setDate(dateObj.getDate() + 7);
        const return_date = dateObj.toISOString().split('T')[0];

        // Update records
        books[bookIdx].quantity -= 1;
        students[studentIdx].no_of_books = (students[studentIdx].no_of_books || 0) + 1;

        const newIssue = {
            id: Date.now(), // simple unique id
            student_id,
            book_id,
            book_name: books[bookIdx].book_name, // Denormalize for easier display
            issue_date,
            return_date,
            fine: 0,
            status: 'issued'
        };

        issued.push(newIssue);

        localStorage.setItem(DB_KEYS.BOOKS, JSON.stringify(books));
        localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(students));
        localStorage.setItem(DB_KEYS.ISSUED_BOOKS, JSON.stringify(issued));

        return { success: true, message: `Book Issued! Return by: ${return_date}` };
    },

    returnBook: async function (student_id, book_id) {
        let issued = JSON.parse(localStorage.getItem(DB_KEYS.ISSUED_BOOKS));
        const matchIdx = issued.findIndex(r => r.student_id === student_id && r.book_id === book_id && r.status === 'issued');

        if (matchIdx === -1) return { success: false, message: "No active issue record found." };

        const record = issued[matchIdx];
        const today = new Date();
        const returnDate = new Date(record.return_date);

        let fine = 0;
        if (today > returnDate) {
            const diffTime = Math.abs(today - returnDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            fine = diffDays * 10;
        }

        // Update Status
        issued[matchIdx].status = 'returned';
        issued[matchIdx].fine = fine;
        issued[matchIdx].actual_return_date = today.toISOString().split('T')[0];

        // Update Stock and Student count
        const books = JSON.parse(localStorage.getItem(DB_KEYS.BOOKS));
        const students = JSON.parse(localStorage.getItem(DB_KEYS.STUDENTS));

        const bookIdx = books.findIndex(b => b.book_id === book_id);
        if (bookIdx !== -1) books[bookIdx].quantity += 1;

        const studentIdx = students.findIndex(s => s.student_id === student_id);
        if (studentIdx !== -1) students[studentIdx].no_of_books = Math.max(0, (students[studentIdx].no_of_books || 1) - 1);

        localStorage.setItem(DB_KEYS.BOOKS, JSON.stringify(books));
        localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(students));
        localStorage.setItem(DB_KEYS.ISSUED_BOOKS, JSON.stringify(issued));

        return { success: true, message: `Return Accepted. Fine: ${fine}` };
    },

    getIssuedBooks: async function (student_id) {
        const issued = JSON.parse(localStorage.getItem(DB_KEYS.ISSUED_BOOKS));
        return issued.filter(r => r.student_id === student_id);
    },

    // --- QUERIES ---
    submitQuery: async function (student_id, query_text) {
        const queries = JSON.parse(localStorage.getItem(DB_KEYS.QUERIES));
        const students = JSON.parse(localStorage.getItem(DB_KEYS.STUDENTS));
        const student = students.find(s => s.student_id === student_id);

        queries.push({
            student_id,
            name: student ? student.name : 'Unknown',
            query_text,
            date: new Date().toISOString()
        });
        localStorage.setItem(DB_KEYS.QUERIES, JSON.stringify(queries));
        return { success: true, message: "Query submitted" };
    },

    getAllQueries: async function () {
        return JSON.parse(localStorage.getItem(DB_KEYS.QUERIES));
    }
};

// Initialize DB on load
db.init();
