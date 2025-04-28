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
    const emailVisible = document.getElementById('show-email')?.checked;

    try {
        const res = await fetch('/api/users/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName,
                lastName,
                major,
                year,
                bio,
                availability,
                visibility: { email: emailVisible }
            })
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
    document.getElementById('show-email').checked = document.getElementById('user-email').textContent !== "[Hidden]";


    // Show the modal
    document.querySelector('.modal-backdrop.edit-profile-modal')?.classList.remove("hidden");

}

function closeProfileEditor() {
    // Hide the modal
    document.querySelector('.modal-backdrop.edit-profile-modal')?.classList.add("hidden");

    // Clear any error messages
    document.querySelectorAll(".error-message").forEach(span => {
        span.textContent = "";
        span.style.display = "none";
    });
}

// Event listener initialization
function initProfileEventListeners() {
    // === Edit Profile Modal ===
    const editProfileBtn = document.getElementById('edit-profile');
    const editModal = document.querySelector('.modal-backdrop.edit-profile-modal');
    const closeEditBtn = editModal?.querySelector('.close-button');
    const saveBtn = editModal?.querySelector('.save-info-btn');

    if (editProfileBtn && editModal) {
        editProfileBtn.addEventListener('click', () => {
            console.log("Edit Profile Button Clicked!");
            openProfileEditor(); // also sets the form fields
        });
    }

    if (closeEditBtn && editModal) {
        closeEditBtn.addEventListener('click', () => {
            editModal.classList.add('hidden');
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', saveInfo);
    }

    // Close edit modal when clicking backdrop (but not inner content)
    editModal?.addEventListener('click', (e) => {
        if (e.target === editModal) {
            editModal.classList.add('hidden');
        }
    });

    // === Schedule Meeting Modal ===
    const scheduleBtn = document.getElementById('schedule-meeting-btn');
    const meetingModal = document.getElementById('meeting-modal');
    const closeMeetingBtn = document.getElementById('close-meeting-modal');
    const submitMeetingBtn = document.getElementById('submit-meeting');

    const inPersonRadio = document.getElementById('in-person');
    const onlineRadio = document.getElementById('online');
    const locationDetailsContainer = document.getElementById('location-details-container');
    const locationDetailsInput = document.getElementById('location-details');
    

    if (scheduleBtn && meetingModal) {
        scheduleBtn.addEventListener('click', () => {
            console.log("Schedule Meeting Button Clicked!");
            meetingModal.classList.remove('hidden');
        });
    }

    if (closeMeetingBtn && meetingModal) {
        closeMeetingBtn.addEventListener('click', () => {
            meetingModal.classList.add('hidden');
        });
    }

    //Submit meeting
    if (submitMeetingBtn && meetingModal) {
        submitMeetingBtn.addEventListener('click', submitMeeting);
    }

    meetingModal?.addEventListener('click', (e) => {    
        if (e.target === meetingModal) {
            meetingModal.classList.add('hidden');
        }
    });
    // Show/hide location detail input based on radio selection
    if (inPersonRadio && onlineRadio && locationDetailsContainer) {
        inPersonRadio.addEventListener('change', () => {
            if (inPersonRadio.checked) {
                locationDetailsContainer.classList.remove('hidden');
            }
        });

        onlineRadio.addEventListener('change', () => {
            if (onlineRadio.checked) {
                locationDetailsContainer.classList.add('hidden');
            }
        });
    }
}

// === Handles Meeting Submission ===
async function submitMeeting() {
    const date = document.getElementById("meeting-date").value;
    const time = document.getElementById("meeting-time").value;
    const duration = document.getElementById("meeting-duration").value;
    const selectedLocation = document.querySelector('input[name="location"]:checked');
    const locationDetails = document.getElementById("location-details").value;
    const tutorEmail = document.getElementById('user-email').textContent;

    if (!date || !time || !duration || !selectedLocation) {
        alert("Please fill out all required fields.");
        return;
    }

    if (selectedLocation.value === 'In-Person' && !locationDetails.trim()) {
        alert("Please provide a location for in-person meetings.");
        return;
    }

    try {
        const res = await fetch('/api/schedule-meeting', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tutorEmail,
                date,
                time,
                duration,
                locationType: selectedLocation.value,
                locationDetails
            })
        });

        const data = await res.json();

        if (res.ok) {
            document.getElementById('meeting-modal').classList.add('hidden');
            alert("Meeting successfully scheduled!");
        } else {
            alert(data.error || "Failed to schedule meeting.");
        }
    } catch (err) {
        console.error(err);
        alert("Something went wrong. Try again later.");
    }
}
