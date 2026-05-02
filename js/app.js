
/* --- UTILS --- */
function showAlert(message, type = 'success') {
    const div = document.createElement('div');
    div.className = `alert alert-${type}`;
    div.textContent = message;

    const container = document.querySelector('.glass-card'); // updated to be closer to form
    // Or just alert() for simplicity as requested by user initially
    if (container) container.insertBefore(div, container.firstChild);

    setTimeout(() => div.remove(), 3000);
}

function getStoredUser(type) {
    const user = localStorage.getItem(type);
    return user ? JSON.parse(user) : null;
}

function logout() {
    localStorage.removeItem('student');
    localStorage.removeItem('admin');
    window.location.href = '../index.html';
}

/* --- STUDENT FUNCTIONS --- */

async function loginStudent(e) {
    e.preventDefault();
    const id = document.getElementById('studentId').value;
    const pass = document.getElementById('password').value;

    try {
        const data = await db.loginStudent(id, pass);

        if (data.success) {
            localStorage.setItem('student', JSON.stringify(data.student));
            window.location.href = 'dashboard/studentDashboard.html';
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert('Login failed');
    }
}

async function registerStudent(e) {
    e.preventDefault();
    const student = {
        student_id: document.getElementById('reg_studentId').value,
        name: document.getElementById('reg_name').value,
        branch: document.getElementById('reg_branch').value,
        year: document.getElementById('reg_year').value,
        password: document.getElementById('reg_password').value
    };

    try {
        const data = await db.registerStudent(student);

        if (data.success) {
            alert(`Registration Successful! Your Library ID is: ${data.library_id}`);
            // Switch to login view
            if (window.showLogin) showLogin();
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert('Registration failed');
    }
}


/* --- ADMIN FUNCTIONS --- */
async function loginAdmin(e) {
    e.preventDefault();
    const id = document.getElementById('adminId').value;
    const pass = document.getElementById('password').value;

    try {
        const data = await db.loginAdmin(id, pass);

        if (data.success) {
            localStorage.setItem('admin', JSON.stringify(data.admin));
            window.location.href = 'dashboard/adminDashboard.html';
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert('Login Error');
    }
}

