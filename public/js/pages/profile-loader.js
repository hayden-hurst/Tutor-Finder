document.addEventListener('DOMContentLoaded', async () => {

    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');

    // Determine the correct endpoint
    const endpoint = userId ? `/api/users/${userId}` : `/api/users/me`;


    try {
        const response = await fetch(endpoint, {
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to fetch profile data');

        const user = await response.json();

        // Populate the profile fields with dynamic data
        document.getElementById('user-fname').textContent = user.firstName
        document.getElementById('user-lname').textContent = user.lastName;
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('user-year').textContent = user.year;
        document.getElementById('user-major').textContent = user.major;
        document.getElementById('user-bio').textContent = user.bio;

        // Now determine if this is the current user's profile
        let isCurrentUser = (endpoint === "/api/users/me");

        // If we're viewing another user's profile by ID, check if it's actually our profile
        if (!isCurrentUser && userId) {
            // Fetch current user data to compare IDs
            const meResponse = await fetch('/api/users/me', {
                credentials: 'include'
            });

            if (meResponse.ok) {
                const currentUser = await meResponse.json();
                isCurrentUser = (currentUser.id === user.id);
            }
        }

        // Show edit button if this is the current user's profile
        if (isCurrentUser) {
            const editBtn = document.getElementById('edit-profile');
            if (editBtn) editBtn.style.display = 'inline-block';
        }
    } catch (error) {
        // Optionally log error or update an existing element
        console.error(error);
        // For example, update the main content container:
        document.querySelector('main').innerHTML = '<p>Error loading profile.</p>';
    }
});
