let isRedirecting = false; // Flag to prevent multiple redirects

async function signup() {
    const firstName = document.getElementById('signup-firstName').value;
    const lastName = document.getElementById('signup-lastName').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const major = document.getElementById('signup-major').value;

    // Form validation
    if (!firstName || !lastName || !email || !password || !major) {
        alert('All fields are required');
        return;
    }

    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password, major })
        });

        const data = await res.json();

        if (res.ok) {
            alert('Signup successful! Please log in.');

            // Prevent multiple redirects
            if (!isRedirecting) {
                isRedirecting = true;
                window.location.href = '/login.html';
            }
        } else {
            alert(data.error || 'Signup failed');
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('An error occurred during signup');
    }
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me')?.checked || false;

    // Basic validation
    if (!email || !password) {
        alert('Email and password are required');
        return;
    }

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, rememberMe })
        });

        const data = await res.json();
        if (res.ok) {
            // Prevent multiple redirects
            if (!isRedirecting) {
                isRedirecting = true;
                // Add small delay to prevent potential race conditions
                setTimeout(() => {
                    window.location.href = '/profile.html';
                }, 100);
            }
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
}

async function logout() {
    console.log("Logout function called"); // Debug log

    try {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        console.log("Logout response:", res.status); // Debug log

        // Even if the server response isn't ok, we'll still log the user out client-side
        if (!isRedirecting) {
            isRedirecting = true;

            // Small delay to allow logs to be seen in console
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 100);
        }
    } catch (error) {
        console.error('Logout error:', error);

        // Even if there's an error, we'll still redirect
        if (!isRedirecting) {
            isRedirecting = true;
            window.location.href = '/index.html';
        }
    }
}

// Use a debounced version of checkAuth to prevent multiple calls
let authCheckInProgress = false;
async function checkAuth() {
    if (authCheckInProgress) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Auth check already in progress'));
            }, 100);
        });
    }

    authCheckInProgress = true;

    try {
        const res = await fetch('/api/auth/profile');
        authCheckInProgress = false;

        if (!res.ok) {
            // If not authenticated, redirect to login page
            if (!isRedirecting) {
                isRedirecting = true;
                window.location.href = '/login.html';
            }
            return false;
        }

        return true;
    } catch (error) {
        authCheckInProgress = false;
        console.error('Auth check error:', error);

        if (!isRedirecting) {
            isRedirecting = true;
            window.location.href = '/login.html';
        }
        return false;
    }
}