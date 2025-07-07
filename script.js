document.addEventListener('DOMContentLoaded', () => {
    // Variables for login form elements will be initialized after robot check
    let loginForm, passwordInput, yetiImage, errorMessage;
    const loginSection = document.getElementById('login-section');

    const YETI_DEFAULT_IMG = 'yeti.png';
    const YETI_CLOSING_EYES_IMG = 'yeti-closing-eyes.png';
    const YETI_ANGRY_IMG = 'yeti-angry.png';
    const YETI_HAPPY_IMG = 'yeti-happy.png';
    const CORRECT_PASSWORD = 'password123';

    function initializeLoginFunctionality() {
        // Get elements now that the login section is supposed to be visible
        loginForm = document.getElementById('login-form');
        passwordInput = document.getElementById('password');
        yetiImage = document.getElementById('yeti-image');
        errorMessage = document.getElementById('error-message');

        // Safety check in case elements are not found
        if (!loginForm || !passwordInput || !yetiImage || !errorMessage) {
            console.error("Could not find all login elements after robot check. Aborting login script initialization.");
            return;
        }

        passwordInput.addEventListener('focus', () => {
            yetiImage.src = YETI_CLOSING_EYES_IMG;
        });

        passwordInput.addEventListener('blur', () => {
            if (yetiImage.src.endsWith(YETI_CLOSING_EYES_IMG)) {
                yetiImage.src = YETI_DEFAULT_IMG;
            }
        });

        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = loginForm.username.value;
            const password = loginForm.password.value;
            errorMessage.textContent = '';

            if (password === CORRECT_PASSWORD) {
                yetiImage.src = YETI_HAPPY_IMG;
                errorMessage.textContent = 'Login Successful!';
                errorMessage.style.color = 'green';
            } else {
                yetiImage.src = YETI_ANGRY_IMG;
                errorMessage.textContent = 'Incorrect username or password.';
                errorMessage.style.color = 'red';
            }
        });
        console.log("Login functionality initialized.");
    }

    // Listen for the custom event dispatched by robot-check.js
    document.addEventListener('robotCheckPassed', () => {
        console.log("Robot check passed event received by main script.");
        // The loginSection should already be made visible by robot-check.js
        initializeLoginFunctionality();
    });

    // Fallback: If for some reason the login section is already visible when this script loads
    // (e.g., robot check is disabled or fails to hide it), try to initialize.
    // This is less likely given the current setup but provides some robustness.
    if (loginSection && getComputedStyle(loginSection).display !== 'none') {
        console.warn("Login section was already visible on DOMContentLoaded. Initializing login script directly.");
        initializeLoginFunctionality();
    }
});
