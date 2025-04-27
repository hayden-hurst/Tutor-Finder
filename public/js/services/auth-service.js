// Flag to prevent multiple redirects
let isRedirecting = false;

// Validation Functions
function validateSignupForm() {
    let isValid = true;

    // Clear all previous error messages
    document.querySelectorAll(".error-message").forEach(span => {
        span.textContent = "";
        span.style.display = "none";
    });

    // Function to show error messages
    function showError(inputId, message) {
        const inputField = document.getElementById(`signup-${inputId}`);
        if (!inputField) return;

        const errorSpan = inputField.nextElementSibling;
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.style.display = message ? "block" : "none";
        }
        isValid = false;
    }

    // Validate first name
    const firstName = document.getElementById("signup-firstName").value.trim();
    if (firstName === "") {
        showError("firstName", "First name is required.");
    }

    // Validate last name
    const lastName = document.getElementById("signup-lastName").value.trim();
    if (lastName === "") {
        showError("lastName", "Last name is required.");
    }

    // Validate email format
    const email = document.getElementById("signup-email").value.trim();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        showError("email", "Enter a valid email address.");
    }

    // Validate university email
    const validateEmail = (email) => {
        if (!email.includes('@')) {
            return false;
        }
        const emailParts = email.split('@');
        return (emailParts[1] === 'uncc.edu' || emailParts[1] === 'charlotte.edu');
    };

    if (!validateEmail(email)) {
        showError("email", "Enter a uncc/charlotte.edu email address");
    }

    // Validate year selection
    const year = document.getElementById("signup-year").value;
    if (year === "") {
        showError("year", "Please select your academic year.");
    }

    // Validate major
    const major = document.getElementById("signup-major").value;
    if (major === "") {
        showError("major", "Major is required.");
    }

    // Validate password strength
    const password = document.getElementById("signup-password").value;
    if (password.length < 6) {
        showError("password", "Password must be at least 6 characters long.");
    }

    // Validate bio (if required)
    const bio = document.getElementById("signup-bio").value.trim();
    if (bio === "" && document.getElementById("signup-bio").hasAttribute("required")) {
        showError("bio", "Bio is required.");
    }

    return isValid;
}

function validateLoginForm() {
    let isValid = true;

    // Clear any previous error messages
    document.querySelectorAll(".error-message").forEach(span => {
        span.textContent = "";
        span.style.display = "none";
    });

    // Function to show error messages
    function showError(input, message) {
        const errorSpan = input.nextElementSibling;
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.style.display = "block";
            errorSpan.style.color = "red";
        }
        isValid = false;
    }

    // Get form elements
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");

    if (!emailInput || !passwordInput) {
        console.error("Login form elements not found");
        return false;
    }

    // Validate email
    const email = emailInput.value.trim();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email === "") {
        showError(emailInput, "Email is required.");
    } else if (!emailPattern.test(email)) {
        showError(emailInput, "Please enter a valid email address.");
    }

    // Validate password
    const password = passwordInput.value;
    if (password === "") {
        showError(passwordInput, "Password is required.");
    } else if (password.length < 6) {
        showError(passwordInput, "Password must be at least 6 characters.");
    }

    return isValid;
}

// API Functions
async function signup(event) {
    if (event) {
        event.preventDefault();
    }

    // Validate form before proceeding
    if (!validateSignupForm()) {
        return;
    }

    // need to use FormData as sending the data as JSON doesnt support file uploads
    const formData = new FormData();

    formData.append('firstName', document.getElementById('signup-firstName').value);
    formData.append('lastName', document.getElementById('signup-lastName').value);
    formData.append('email', document.getElementById('signup-email').value);
    formData.append('password', document.getElementById('signup-password').value);
    formData.append('major', document.getElementById('signup-major').value);
    formData.append('year', document.getElementById('signup-year').value);
    formData.append('bio', document.getElementById('signup-bio').value);

    const imageFile = document.getElementById('signup-image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (res.ok) {
            alert('Signup successful.');

            // Prevent multiple redirects
            if (!isRedirecting) {
                isRedirecting = true;
                window.location.href = '/login';
            }
        } else {
            // Display server-side validation errors if any
            if (data.error) {
                alert(data.error);
            } else {
                alert('Signup failed. Please try again.');
            }
            console.log(data.error || 'Signup failed');
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('An error occurred during signup. Please try again later.');
    }
}

async function login(event) {
    if (event) {
        event.preventDefault();
    }

    // Validate form before proceeding
    if (!validateLoginForm()) {
        return;
    }

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me')?.checked || false;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, rememberMe }),
            credentials: 'same-origin'
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("email", email);
            const redirectTo = new URLSearchParams(window.location.search).get('redirectTo') || '/';
            console.log(redirectTo);
            // Ensure that no multiple redirects happen
            if (!isRedirecting) {
                isRedirecting = true;
                setTimeout(() => {
                    window.location.href = redirectTo; // Use the redirect URL from the server
                }, 500);
            }
        } else {
            const errorMessage = data.error || 'Login failed. Please check your credentials.';
            alert(errorMessage);
            console.log(errorMessage);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again later.');
    } finally {
        // Reset the redirect flag in case of any errors or successful redirect
        isRedirecting = false;
    }
}

async function logout() {
    localStorage.removeItem("email"); //delete email upon logout

    try {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            console.log("Logout successful, redirecting...");
            window.location.href = '/login';
        } else {
            console.error("Logout failed with status:", res.status);
            alert("Logout failed. Please try again.");
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('An error occurred during logout. Please try again later.');
    }
}

// Image Preview Function
function loadImagePreview() {
    const image = document.getElementById("image").files[0];
    if (image) {
        const imageUrl = URL.createObjectURL(image);
        document.getElementById("load-image").innerHTML = `<img src="${imageUrl}" alt="Preview">`;
    } else {
        alert("Please select an image to load.");
    }
}

// Event Listeners Initialization
function initAuthEventListeners() {
    // Signup form submit event
    const signupForm = document.querySelector("form[id='signup-form']");
    if (signupForm) {
        signupForm.addEventListener("submit", signup);
    }

    // Login form submit event
    const loginForm = document.querySelector("form[id='login-form']");
    if (loginForm) {
        loginForm.addEventListener("submit", login);
    }

    // Logout button event
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

    // Image load button event
    const loadImageBtn = document.getElementById("load-image-btn");
    if (loadImageBtn) {
        loadImageBtn.addEventListener("click", loadImagePreview);
    }

    // Add time block events (after DOM is fully loaded)
    document.querySelectorAll('.add-time-block').forEach(button => {
        button.addEventListener('click', () => {
            const day = button.getAttribute('data-day');
            const container = document.querySelector(`.availability-day[data-day="${day}"] .time-blocks`);

            const block = document.createElement('div');
            block.classList.add('time-block');
            block.innerHTML = `
                <input type="time" class="start-time" data-day="${day}">
                <input type="time" class="end-time" data-day="${day}">
                <button type="button" class="remove-block">Remove</button>
            `;
            container.appendChild(block);

            // Allow removal
            block.querySelector('.remove-block').addEventListener('click', () => {
                block.remove();
            });
        });
    });
}

// Initialize event listeners when DOM is fully loaded
document.addEventListener("DOMContentLoaded", initAuthEventListeners);

function getAvailabilityData() {
    const availability = [];

    document.querySelectorAll('.availability-day').forEach(dayContainer => {
        const day = dayContainer.getAttribute('data-day');
        const blocks = dayContainer.querySelectorAll('.time-block');

        blocks.forEach(block => {
            const start = block.querySelector('.start-time').value;
            const end = block.querySelector('.end-time').value;
            if (start && end) {
                availability.push({ day, start, end });
            }
        });
    });

    return availability;
}
