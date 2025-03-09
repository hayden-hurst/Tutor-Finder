document.addEventListener('DOMContentLoaded', () => {
    // Fetch users and render them
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            const userList = document.getElementById('user-list');
            userList.innerHTML = ''; // Clear any existing content

            console.log(users)

            // Loop through users and create a div for each
            users.forEach(user => {
                const tutorDiv = document.createElement('div');
                tutorDiv.classList.add('tutor');

                // Only display firstName, lastName, and email
                tutorDiv.innerHTML = `
                    <div class="tutor-info">
                        <span>${user.firstName} ${user.lastName}</span>
                        <span>Email: ${user.email}</span>
                    </div>
                `;
                userList.appendChild(tutorDiv);
                
            });
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
});
