document.addEventListener('DOMContentLoaded', () => {
    let allUsers = []; // Store all fetched users
    let filteredUsers = [];
    const userList = document.getElementById('user-list');
    const searchBar = document.getElementById('search-bar'); 
    const prevButton = document.getElementById('prev-button'); //previous button
    const nextButton = document.getElementById('next-button'); //next button
    let currentPage = 1;
    const usersPerPage = 10; //Load 10 users per 'page'
    const tutorOnlyCheckbox = document.getElementById('filter-tutors-only');

    // Fetch and store users
    fetch('/api/users/list')
        .then(response => response.json())
        .then(users => {
            allUsers = users;
            filteredUsers = [...allUsers];
            renderUsers();
            updatePagination();
        })
        .catch(error => console.error('Error fetching users:', error));

    // Function to render users
    function renderUsers() {
        userList.innerHTML = ''; // Clear the list
        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        const usersToDisplay = filteredUsers.slice(startIndex, endIndex);

        usersToDisplay.forEach(user => {
            const tutorDiv = document.createElement('div');
            tutorDiv.classList.add('tutor');
            tutorDiv.innerHTML = `
                <div class="tutor-info">
                    <a href="profile?userId=${user._id}">
                        ${user.firstName} ${user.lastName}
                    </a>
                    <span>${user.email}</span>
                    <span>${user.major}</span>
                </div>
            `;
            userList.appendChild(tutorDiv);
        });
    }

    //Update buttons
    function updatePagination() {
        const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages || totalPages === 0;
    }

    //Buttons (next/prev page)
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderUsers();
            updatePagination();
        }
    })
    nextButton.addEventListener('click', () => {
        if (currentPage < Math.ceil(allUsers.length / usersPerPage)){
            currentPage++;
            renderUsers();
            updatePagination();
        }
    })


    // Function to filter users based on search input
    function filterUsers() {
        const searchTerm = searchBar.value.toLowerCase();
        const showOnlyTutors = tutorOnlyCheckbox.checked;

        filteredUsers = allUsers.filter(user =>
            user.firstName.toLowerCase().includes(searchTerm) || 
            user.lastName.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm) ||
            user.major.toLowerCase().includes(searchTerm)
        );

        if (showOnlyTutors) {
            filteredUsers = filteredUsers.filter(user => user.roles && user.roles.tutor === true);
        }

        currentPage = 1; //Reset to first page after filtering

        renderUsers(filteredUsers);
        updatePagination();
    }

    // Event listener for search input and tutor filter
    searchBar.addEventListener('input', filterUsers);
    tutorOnlyCheckbox.addEventListener('change', filterUsers);
});
