# 📚 SVU Library Management System

A robust, full‑stack **Library Management System** designed to streamline student and administrator workflows at Sri Venkateswara University.  
Built with **HTML, CSS (Glassmorphism UI), JavaScript, Node.js (Express), and SQLite**, this project demonstrates end‑to‑end system design, database integration, and secure role‑based access.

---

## 🚀 Key Highlights
- **Role‑based Access**: Separate login and dashboards for Students and Admins.
- **Database‑Driven**: SQLite backend (`svuLibrary.db`) with initialization scripts for reproducibility.
- **Modern UI**: Variable‑based CSS with Glassmorphism styling for a clean, professional interface.
- **Secure Operations**: Node.js Express server mediates all database interactions, ensuring safe file access.
- **Comprehensive Features**:
  - Student: Registration, login, profile view (issued books, fines), query submission.
  - Admin: Manage students/books, issue/return books with fine calculation, respond to queries.

---

## 📂 Project Structure
SVU_Library_Management/
│
├── index.html              # Home page
├── studentLogin.html       # Student login & registration
├── adminLogin.html         # Admin login
├── dashboard/              # Role-specific dashboards
├── css/                    # Styling (Glassmorphism, variables)
├── db/                     # SQLite database & init script
├── server.js               # Node.js Express backend
├── js/                     # Frontend logic
├── images/                 # Static assets
└── README.md               # Documentation

Code


---

## ⚙️ Prerequisites
- [Node.js](https://nodejs.org/) installed locally.

---

## 🛠️ Setup & Run
1. **Install Dependencies**
   ```bash
   npm install
Initialize Database (optional reset)

bash
npm run init-db
Start the Server

bash
npm start
Access Application
Open http://localhost in your browser.

🔑 Default Accounts
Admin → ID: admin | Password: admin123

Student → ID: S001 | Password: student123 (or register a new student)

🧩 Technical Notes
Backend: Minimal Node.js Express server for safe SQLite interactions.

Frontend: All application logic, validation, and UI handled in JavaScript.

📊 Tech Stack
Frontend: HTML, CSS, JavaScript

Backend: Node.js (Express)

Database: SQLite

UI/UX: Glassmorphism, responsive design

📈 Roadmap
🔒 Enhance authentication with JWT or OAuth.

📱 Add mobile‑responsive layouts.

📊 Integrate analytics dashboard for usage insights.

☁️ Deploy on cloud (Heroku/Railway) for production use.

👨‍💻 Author
Developed by Vamsi Sakepuram  
Data Science Project Developer | Hackathon Winner | Full‑Stack Enthusiast
