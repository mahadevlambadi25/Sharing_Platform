const registerForm = document.getElementById('registerForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear errors
    nameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';

    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const passwordVal = passwordInput.value;

    if (!nameVal || !emailVal || !passwordVal) {
        if (!nameVal) nameError.textContent = 'Name is required.';
        if (!emailVal) emailError.textContent = 'Email is required.';
        if (!passwordVal) passwordError.textContent = 'Password is required.';
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';

        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameVal,
                email: emailVal,
                password: passwordVal
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed. Please try again.');
        }

        // Store registration info for display on login screen if desired
        localStorage.setItem('registrationSuccess', 'Account created successfully! Please sign in.');
        
        // Redirect to Login Page
        window.location.href = 'index.html';

    } catch (err) {
        console.error('Registration error:', err);
        passwordError.textContent = err.message;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
    }
});
