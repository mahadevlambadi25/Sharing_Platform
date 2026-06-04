const userTab = document.getElementById('userTab');
const adminTab = document.getElementById('adminTab');
const loginTitle = document.getElementById('loginTitle');
const loginSubtitle = document.getElementById('loginSubtitle');
const submitBtn = document.getElementById('submitBtn');
const redirectText = document.getElementById('redirectText');
const emailInput = document.getElementById('email');

let currentRole = 'student';

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