let isRedirecting = false; // Flag to prevent multiple redirects

async function signup() {
    const firstName = document.getElementById('signup-firstName').value;
    const lastName = document.getElementById('signup-lastName').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const major = document.getElementById('signup-major').value;

    // Form validation
    if (!firstName || !lastName || !email || !password || !major) {
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
            console.log('Signup successful.');

            // Prevent multiple redirects
            if (!isRedirecting) {
                isRedirecting = true;
                window.location.href = '/login.html';
            }
        } else {
            console.log(data.error || 'Signup failed');
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
            console.log(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        console.log('An error occurred during login');
    }
}

async function logout() {
    console.log("Logout function called"); // Debug log

    try {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            console.log("Logout successful, redirecting..."); // Debug log

            // Reload the page to reflect changes
            window.location.reload();

            // Alternatively, redirect to login page for protected pages
            if (window.location.pathname.includes('calendar.html') || window.location.pathname.includes('profile.html')) {
                window.location.href = '/login.html';
            }
        } else {
            console.error("Logout failed with status:", res.status);
        }
    } catch (error) {
        console.error('Logout error:', error);
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
