document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/auth/profile');
        if (!response.ok) throw new Error('Failed to fetch profile data');

        const user = await response.json();

        // Populate the profile fields with dynamic data
        document.getElementById('user-fname').textContent = user.firstName
        document.getElementById('user-lname').textContent = user.lastName;
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('user-year').textContent = user.year;
        document.getElementById('user-major').textContent = user.major;
        document.getElementById('user-bio').textContent = user.bio;
    } catch (error) {
        // Optionally log error or update an existing element
        console.error(error);
        // For example, update the main content container:
        document.querySelector('main').innerHTML = '<p>Error loading profile.</p>';
    }
});
