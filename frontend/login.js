const userTab = document.getElementById('userTab');
const adminTab = document.getElementById('adminTab');
const loginTitle = document.getElementById('loginTitle');
const loginSubtitle = document.getElementById('loginSubtitle');
const submitBtn = document.getElementById('submitBtn');
const redirectText = document.getElementById('redirectText');
const emailInput = document.getElementById('email');

let currentRole = 'student';

// Check for registration success message
const regSuccessMsg = localStorage.getItem('registrationSuccess');
if (regSuccessMsg) {
    loginSubtitle.textContent = regSuccessMsg;
    loginSubtitle.style.color = '#027a48';
    loginSubtitle.style.fontWeight = '600';
    localStorage.removeItem('registrationSuccess');
}

adminTab.addEventListener('click',() => {
    currentRole = 'admin';

    adminTab.classList.add('active');
    userTab.classList.remove('active');

    loginTitle.textContent = 'Admin Portal';
    loginSubtitle.textContent = 'Access the platform moderation panel.';
    submitBtn.textContent = 'Sign In as Admin';
    emailInput.placeholder = 'admin@navgurukul.org';

    redirectText.style.display = 'none';
});

userTab.addEventListener('click',() => {
    currentRole = 'student'

    userTab.classList.add('active');
    adminTab.classList.remove('active');

    loginTitle.textContent = 'Student Portal';
    loginSubtitle.textContent = 'Log in to access campus chargers, books and more.';
    submitBtn.textContent = 'Sign In as Student';
    emailInput.placeholder = 'yourname25@navgurukul.org'

    redirectText.style.display = 'block';
});

// Form Submission Handler
const loginForm = document.getElementById('loginForm');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    emailError.textContent = '';
    passwordError.textContent = '';

    const emailVal = emailInput.value.trim();
    const passwordVal = document.getElementById('password').value;

    if (!emailVal || !passwordVal) {
        if (!emailVal) emailError.textContent = 'Username or email is required.';
        if (!passwordVal) passwordError.textContent = 'Password is required.';
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Authenticating...';

        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailVal,
                password: passwordVal
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Authentication failed. Please check your credentials.');
        }

        // Save token and user details to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            id: data._id,
            name: data.name,
            email: data.email,
            role: data.role
        }));

        // Redirect based on role
        if (data.role === 'admin') {
            window.location.href = 'admin_dashboard.html';
        } else {
            window.location.href = 'user_dashboard.html';
        }

    } catch (err) {
        console.error('Login error:', err);
        // Display error message to user
        passwordError.textContent = err.message;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = currentRole === 'admin' ? 'Sign In as Admin' : 'Sign In as Student';
    }
});