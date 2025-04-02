document.addEventListener('DOMContentLoaded', () => {
    let allUsers = []; // Store all fetched users
    const userList = document.getElementById('user-list');
    const searchBar = document.getElementById('search-bar'); 
    const prevButton = document.getElementById('prev-button'); //previous button
    const nextButton = document.getElementById('next-button'); //next button
    let currentPage = 1;
    const usersPerPage = 10; //Load 10 users per 'page'

    // Fetch and store users
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            allUsers = users;
            renderUsers(allUsers);
            updatePagination();
        })
        .catch(error => console.error('Error fetching users:', error));

    // Function to render users
    function renderUsers(users) {
        userList.innerHTML = ''; // Clear the list
        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        const usersToDisplay = users.slice(startIndex, endIndex);

        usersToDisplay.forEach(user => {
            const tutorDiv = document.createElement('div');
            tutorDiv.classList.add('tutor');
            tutorDiv.innerHTML = `
                <div class="tutor-info">
                <a href="profile.html?userId=${user._id}">
                    ${user.firstName} ${user.lastName}
                </a>
            <span>${user.email}</span>
        </div>
    `;
            userList.appendChild(tutorDiv);
        });
    }

    //Update buttons
    function updatePagination() {
        const totalPages = Math.ceil(allUsers.length / usersPerPage);
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
    }

    //Buttons (next/prev page)
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderUsers(allUsers);
            updatePagination();
        }
    })
    nextButton.addEventListener('click', () => {
        if (currentPage < Math.ceil(allUsers.length / usersPerPage)){
            currentPage++;
            renderUsers(allUsers);
            updatePagination();
        }
    })


    // Function to filter users based on search input
    function filterUsers() {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredUsers = allUsers.filter(user =>
            user.firstName.toLowerCase().includes(searchTerm) || 
            user.lastName.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm)
        );
        renderUsers(filteredUsers);
        updatePagination();
    }

    // Event listener for search input
    searchBar.addEventListener('input', filterUsers);
});
