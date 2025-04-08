// This script updates the navigation bar based on authentication status
document.addEventListener('DOMContentLoaded', async () => {
    const isLoggedIn = await checkAuth();
    renderNavbar(isLoggedIn);
});

async function checkAuth() {
    try {
        const res = await fetch('/api/auth/session');
        return res.ok;
    } catch (err) {
        console.error('Auth check failed:', err);
        return false;
    }
}

function renderNavbar(isLoggedIn) {
    const navList = document.querySelector('nav ul');
    if (!navList) return;

    navList.innerHTML = '';

    const links = isLoggedIn
        ? [
            { href: '/', text: 'Home' },
            { href: '/calendar', text: 'Calendar' },
            { href: '/profile', text: 'Profile' },
            { href: '#', text: 'Logout', isLogout: true }
        ]
        : [
            { href: '/', text: 'Home' },
            { href: '/calendar', text: 'Calendar' },
            { href: '/profile', text: 'Profile' },
            { href: '/login', text: 'Log In' },
            { href: '/signup', text: 'Sign Up' }
        ];

    links.forEach(({ href, text, isLogout }) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = href;
        a.textContent = text;

        if (isLogout) {
            a.addEventListener('click', async (e) => {
                e.preventDefault();
                await logout(); // call your logout logic
            });
        }

        li.appendChild(a);
        navList.appendChild(li);
    });
}