function validateProfileForm() {
    let isValid = true;

    // Clear all previous error messages
    document.querySelectorAll(".error-message").forEach(span => {
        span.textContent = "";
        span.style.display = "none";
    });

    // Function to show error messages
    function showError(inputId, message) {
        const inputField = document.getElementById(`edit-${inputId}`);
        if (!inputField) return;

        const formGroup = inputField.closest('.form-group');
        const errorSpan = formGroup?.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.style.display = message ? "block" : "none";
        }

        isValid = false;
    }

    // Validate first name
    const firstName = document.getElementById("edit-firstName").value.trim();
    if (firstName === "") {
        showError("firstName", "First name is required.");
    }

    // Validate last name
    const lastName = document.getElementById("edit-lastName").value.trim();
    if (lastName === "") {
        showError("lastName", "Last name is required.");
    }

    // Validate year selection
    const year = document.getElementById("edit-year").value;
    if (year === "") {
        showError("year", "Please select your academic year.");
    }

    // Validate major
    const major = document.getElementById("edit-major").value;
    if (major === "") {
        showError("major", "Major is required.");
    }

    return isValid;
}

async function saveInfo(event){
    if(event){
        event.preventDefault();
    }

    // Validate form before proceeding
    if (!validateProfileForm()) {
        return;
    }

    const firstName = document.getElementById('edit-firstName').value;
    const lastName = document.getElementById('edit-lastName').value;
    const major = document.getElementById('edit-major').value;
    const year = document.getElementById('edit-year').value;
    const bio = document.getElementById('edit-bio').value;

    try {
        const res = await fetch('/api/users/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, major, year, bio })
        });

        const data = await res.json();

        if (res.ok) {
            alert('Profile edit successful.');
            // Refresh page
            window.location.reload();

        } else {
            // Display server-side validation errors if any
            if (data.error) {
                alert(data.error);
            } else {
                alert('Profile edit failed. Please try again.');
            }
            console.log(data.error || 'Profile edit failed');
        }
    } catch (error) {
        console.error('Profile edit:', error);
        alert('An error occurred during profile edit. Please try again later.');
    }
}

// Modal control functions
function openProfileEditor() {
    // Get current profile data
    const firstName = document.getElementById('user-fname').textContent;
    const lastName = document.getElementById('user-lname').textContent;
    const year = document.getElementById('user-year').textContent;
    const major = document.getElementById('user-major').textContent;
    const bio = document.getElementById('user-bio').textContent;

    // Set form values
    document.getElementById('edit-firstName').value = firstName;
    document.getElementById('edit-lastName').value = lastName;

    // Set select dropdowns
    const yearSelect = document.getElementById('edit-year');
    for (let i = 0; i < yearSelect.options.length; i++) {
        if (yearSelect.options[i].value === year) {
            yearSelect.selectedIndex = i;
            break;
        }
    }

    const majorSelect = document.getElementById('edit-major');
    for (let i = 0; i < majorSelect.options.length; i++) {
        if (majorSelect.options[i].value === major) {
            majorSelect.selectedIndex = i;
            break;
        }
    }

    document.getElementById('edit-bio').value = bio;

    // Show the modal
    document.querySelector('.modal-backdrop').style.display = 'flex';
}

function closeProfileEditor() {
    // Hide the modal
    document.querySelector('.modal-backdrop').style.display = 'none';

    // Clear any error messages
    document.querySelectorAll(".error-message").forEach(span => {
        span.textContent = "";
        span.style.display = "none";
    });
}

// Event listener initialization
function initProfileEventListeners() {
    // Edit profile button
    const editProfileBtn = document.getElementById('edit-profile');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', openProfileEditor);
    }

    // Close modal button
    const closeBtn = document.querySelector('.close-button');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProfileEditor);
    }

    // Save info button
    const saveBtn = document.querySelector('.save-info-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveInfo);
    }

    // Modal backdrop click to close
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', function(event) {
            if (event.target === modalBackdrop) {
                closeProfileEditor();
            }
        });
    }
}

// Initialize event listeners when DOM is fully loaded
document.addEventListener("DOMContentLoaded", initProfileEventListeners);