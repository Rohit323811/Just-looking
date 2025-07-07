document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password');
    const yetiImage = document.getElementById('yeti-image');
    const errorMessage = document.getElementById('error-message');

    // Placeholder image paths - these will be updated in a later step
    const YETI_DEFAULT_IMG = 'yeti.png';
    const YETI_CLOSING_EYES_IMG = 'yeti-closing-eyes.png';
    const YETI_ANGRY_IMG = 'yeti-angry.png';
    const YETI_HAPPY_IMG = 'yeti-happy.png'; // Assuming a happy image for correct password

    // Hardcoded correct password for demonstration
    const CORRECT_PASSWORD = 'password123';

    // Event listener for password input focus (typing)
    passwordInput.addEventListener('focus', () => {
        yetiImage.src = YETI_CLOSING_EYES_IMG;
    });

    // Event listener for password input blur (stopped typing)
    passwordInput.addEventListener('blur', () => {
        // Revert to default if not angry (e.g., after incorrect attempt)
        if (yetiImage.src.endsWith(YETI_CLOSING_EYES_IMG)) {
            yetiImage.src = YETI_DEFAULT_IMG;
        }
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent actual form submission

        const username = loginForm.username.value;
        const password = loginForm.password.value;
        errorMessage.textContent = ''; // Clear previous error messages

        if (password === CORRECT_PASSWORD) {
            // alert('Login successful!'); // Replace with more sophisticated feedback if needed
            yetiImage.src = YETI_HAPPY_IMG; // Or back to default/happy yeti
            errorMessage.textContent = 'Login Successful!';
            errorMessage.style.color = 'green';

            // Optionally, redirect or perform other actions
        } else {
            yetiImage.src = YETI_ANGRY_IMG;
            errorMessage.textContent = 'Incorrect username or password.';
            errorMessage.style.color = 'red';
        }
    });
});
