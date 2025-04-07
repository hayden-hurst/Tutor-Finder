document.addEventListener('DOMContentLoaded', async () => {

    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');

    // get the correct endpoint first
    const endpoint = userId ? `/api/users/${userId}` : `/api/users/me`;


    try {
        const response = await fetch(endpoint, {
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to fetch profile data');

        const user = await response.json();
        const visibility = user.visibility || {};

        const isUser = !userId || userId === user._id; // checks if the userId of a profile matches the database entry for that user

        document.getElementById('user-fname').textContent = user.firstName
        document.getElementById('user-lname').textContent = user.lastName;
        document.getElementById('user-email').textContent =  
        // shows the email if a user is viewing their own profile or the user has allowed others to see their email, if neither are true, email is hidden
        isUser ? user.email : (visibility.email ? user.email : "[Hidden]");
        document.getElementById('user-year').textContent = user.year;
        document.getElementById('user-major').textContent = user.major;
        document.getElementById('user-bio').textContent = user.bio;

        // Default to not showing edit button unless confirmed it's the current user
        let isCurrentUser = false;

        if (endpoint === "/api/users/me") {
            // If we're on the /me endpoint, it's definitely the current user
            isCurrentUser = true;
        } else if (userId) {
            // If we're viewing a profile by ID, fetch current user and compare
            const meResponse = await fetch('/api/users/me', {
                credentials: 'include'
            });

            if (meResponse.ok) {
                const currentUser = await meResponse.json();
                // Compare the MongoDB _id fields
                isCurrentUser = (user._id === currentUser._id);
            }
        }

        // Show or hide edit button based on whether it's the current user's profile
        const editBtn = document.getElementById('edit-profile');
        if (editBtn) {
            editBtn.style.display = isCurrentUser ? 'inline-block' : 'none';
        }
    } catch (error) {
        // Optionally log error or update an existing element
        console.error(error);
        // For example, update the main content container:
        document.querySelector('main').innerHTML = '<p>Error loading profile.</p>';
    }
});
