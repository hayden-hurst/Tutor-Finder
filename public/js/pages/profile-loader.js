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

        //Availability check
        if (user.availability && Array.isArray(user.availability)) {
            window.tutorAvailability = user.availability; 
        }
        

        const isUser = !userId || userId === user._id; // checks if the userId of a profile matches the database entry for that user

        document.getElementById('user-fname').textContent = user.firstName
        document.getElementById('user-lname').textContent = user.lastName;
        document.getElementById('user-email').textContent =  
        // shows the email if a user is viewing their own profile or the user has allowed others to see their email, if neither are true, email is hidden
        isUser ? user.email : (visibility.email ? user.email : "[Hidden]");
        document.getElementById('user-year').textContent = user.year;
        document.getElementById('user-major').textContent = user.major;
        document.getElementById('user-bio').textContent = user.bio;

        // setting the users profile image
        const profilePic = user.profileImage || '/images/Default_pfp.jpg';
        const imgElement = document.querySelector('.profile-img img');
            if (imgElement) {
                imgElement.src = profilePic;
            }

        // displays the users availability on their profile page
        const availabilityContainer = document.getElementById('user-availability');
        if (availabilityContainer && Array.isArray(user.availability)) {
            for (const time of user.availability) {
                availabilityContainer.innerHTML += `<p>${time.day}: ${time.start} - ${time.end}</p>`;
            }
        }

        //Roles
        document.getElementById('user-role').textContent = [
            user.roles?.tutor ? 'Tutor' : null,
            user.roles?.tutee ? 'Tutee' : null
        ].filter(Boolean).join(', ') || "No role selected";


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

        // Show or hide schedule meeting button based on whether its the current user's profile
        // Show or hide "Schedule Meeting" button
        const scheduleContainer = document.getElementById("schedule-meeting-container");
        if (scheduleContainer) {
            scheduleContainer.classList.toggle("hidden", isCurrentUser); // hide if it's YOUR profile
        }
        

        // Now that the DOM is populated, hook up the modal buttons
        if (typeof initProfileEventListeners === 'function') {
            initProfileEventListeners(); // this binds the modal open/close handlers
        }



    } catch (error) {
        // Optionally log error or update an existing element
        console.error(error);
        // For example, update the main content container:
        document.querySelector('main').innerHTML = '<p>Error loading profile.</p>';
    }
});
