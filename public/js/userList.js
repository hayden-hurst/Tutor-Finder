document.addEventListener('DOMContentLoaded', () => {
    let allUsers = []; // Store all fetched users
    const userList = document.getElementById('user-list');
    const searchBar = document.getElementById('search-bar');

    // Fetch and store users
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            allUsers = users;
            renderUsers(allUsers);
        })
        .catch(error => console.error('Error fetching users:', error));

    // Function to render users
    function renderUsers(users) {
        userList.innerHTML = ''; // Clear the list
        users.forEach(user => {
            const tutorDiv = document.createElement('div');
            tutorDiv.classList.add('tutor');
            tutorDiv.innerHTML = `
                <div class="tutor-info">
                    <span>${user.firstName} ${user.lastName}</span>
                    <span>${user.email}</span>
                </div>
            `;
            userList.appendChild(tutorDiv);
        });
    }

    // Function to filter users based on search input
    function filterUsers() {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredUsers = allUsers.filter(user =>
            user.firstName.toLowerCase().includes(searchTerm) || 
            user.lastName.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm)
        );
        renderUsers(filteredUsers);
    }

    // Event listener for search input
    searchBar.addEventListener('input', filterUsers);
});
