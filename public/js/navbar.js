// This script updates the navigation bar based on authentication status
document.addEventListener('DOMContentLoaded', function() {
    // Check for authentication status
    fetch('/api/auth/profile')
        .then(response => {
            if (response.ok) {
                // User is logged in - show logout, hide login/signup
                updateNavForLoggedInUser();
            } else {
                // User is not logged in - show login/signup, hide logout
                updateNavForLoggedOutUser();
            }
        })
        .catch(error => {
            console.error('Error checking auth status:', error);
            // Default to logged out state if there's an error
            updateNavForLoggedOutUser();
        });
});

function updateNavForLoggedInUser() {
    const navList = document.querySelector('nav ul');

    // Find the login and signup links
    const loginItem = findNavItem(navList, 'login.html');
    const signupItem = findNavItem(navList, 'signup.html');

    // Remove login and signup links if they exist
    if (loginItem) navList.removeChild(loginItem);
    if (signupItem) navList.removeChild(signupItem);

    // Check if logout link already exists
    const logoutItem = findNavItem(navList, 'logout');

    // Add logout link if it doesn't exist
    if (!logoutItem) {
        const newLogoutItem = document.createElement('li');
        newLogoutItem.innerHTML = '<a href="#" onclick="logout(); return false;">Logout</a>';
        navList.appendChild(newLogoutItem);
    }
}

function updateNavForLoggedOutUser() {
    const navList = document.querySelector('nav ul');

    // Find the login, signup, and logout links
    const loginItem = findNavItem(navList, 'login.html');
    const signupItem = findNavItem(navList, 'signup.html');
    const logoutItem = findNavItem(navList, 'logout');

    // Remove logout link if it exists
    if (logoutItem) navList.removeChild(logoutItem);

    // Add login link if it doesn't exist
    if (!loginItem) {
        const newLoginItem = document.createElement('li');
        newLoginItem.innerHTML = '<a href="login.html">Log In</a>';
        navList.appendChild(newLoginItem);
    }

    // Add signup link if it doesn't exist
    if (!signupItem) {
        const newSignupItem = document.createElement('li');
        newSignupItem.innerHTML = '<a href="signup.html">Sign Up</a>';
        navList.appendChild(newSignupItem);
    }
}

function findNavItem(navList, href) {
    const items = navList.querySelectorAll('li');

    for (let i = 0; i < items.length; i++) {
        const link = items[i].querySelector('a');
        if (link && link.getAttribute('href')?.includes(href)) {
            return items[i];
        }
    }

    return null;
}