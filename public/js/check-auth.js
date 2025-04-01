// This file handles authentication checks for protected pages
document.addEventListener('DOMContentLoaded', function() {
    // Don't run authentication check on login or signup pages
    const currentPage = window.location.pathname;
    if (currentPage.includes('login.html') || currentPage.includes('signup.html')) {
        return; // Skip auth check on login/signup pages
    }

    // Check if user is authenticated
    checkAuth()
        .catch(error => {
            console.error('Authentication check failed:', error);

            // Prevent redirect loops by checking if we're already on the login page
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = '/login.html';
            }
        });
});