document.addEventListener('DOMContentLoaded', () => {
    const robotCheckContainer = document.getElementById('robot-check-container');
    const canvas = document.getElementById('robot-check-canvas');
    const ctx = canvas.getContext('2d');
    const loginSection = document.getElementById('login-section');

    // --- Configuration ---
    const CANVAS_WIDTH = 500; // Adjust as needed
    const CANVAS_HEIGHT = 300; // Adjust as needed
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const SNAKE_HEAD_SIZE = 20; // Diameter
    const SNAKE_BODY_SEGMENT_SIZE = 18; // Diameter
    const SNAKE_SPEED = 2; // Pixels per frame
    const NEON_BLOCK_SIZE = 30;

    // Placeholder for images - will be drawn as colored shapes for now
    // const snakeHeadImg = new Image();
    // snakeHeadImg.src = 'dragon-snake-head.png';
    // const snakeBodyImg = new Image();
    // snakeBodyImg.src = 'dragon-snake-body.png';
    // const neonBlockImg = new Image();
    // neonBlockImg.src = 'neon-block.png';

    let snake = [
        { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 } // Head
        // Body segments will be added dynamically
    ];
    let numSegments = 5; // Initial number of body segments after the head

    for (let i = 1; i <= numSegments; i++) {
        snake.push({ x: snake[0].x - i * (SNAKE_BODY_SEGMENT_SIZE / 2), y: snake[0].y });
    }

    let targetPos = { x: snake[0].x, y: snake[0].y }; // Mouse/touch target

    let neonBlock = {
        x: Math.random() * (CANVAS_WIDTH - NEON_BLOCK_SIZE),
        y: Math.random() * (CANVAS_HEIGHT - NEON_BLOCK_SIZE)
    };

    let gameRunning = true;

    // --- Input Handling ---
    function updateTargetPosition(event) {
        const rect = canvas.getBoundingClientRect();
        if (event.touches && event.touches.length > 0) {
            targetPos.x = event.touches[0].clientX - rect.left;
            targetPos.y = event.touches[0].clientY - rect.top;
        } else {
            targetPos.x = event.clientX - rect.left;
            targetPos.y = event.clientY - rect.top;
        }
    }

    canvas.addEventListener('mousemove', updateTargetPosition);
    canvas.addEventListener('touchstart', updateTargetPosition, { passive: true });
    canvas.addEventListener('touchmove', updateTargetPosition, { passive: true });

    // --- Game Logic ---
    function moveSnake() {
        if (!gameRunning) return;

        const head = { ...snake[0] }; // New head position

        // Move head towards target
        const dx = targetPos.x - head.x;
        const dy = targetPos.y - head.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > SNAKE_SPEED) {
            head.x += (dx / distance) * SNAKE_SPEED;
            head.y += (dy / distance) * SNAKE_SPEED;
        } else {
            head.x = targetPos.x;
            head.y = targetPos.y;
        }

        // Clamp head position to canvas bounds
        head.x = Math.max(SNAKE_HEAD_SIZE / 2, Math.min(CANVAS_WIDTH - SNAKE_HEAD_SIZE / 2, head.x));
        head.y = Math.max(SNAKE_HEAD_SIZE / 2, Math.min(CANVAS_HEIGHT - SNAKE_HEAD_SIZE / 2, head.y));


        // Add new head and remove tail to make snake move
        snake.unshift(head); // Add new head

        // Keep snake length consistent, make body follow
        // The last segment moves to where the second to last was, and so on.
        // More sophisticated segment following can be implemented if needed.
        // For now, we just ensure the array doesn't grow indefinitely beyond initial setup.
        // A better approach for smooth following:
        for (let i = snake.length - 1; i > 0; i--) {
            const prevSegment = snake[i-1];
            const currentSegment = snake[i];
            const segDx = prevSegment.x - currentSegment.x;
            const segDy = prevSegment.y - currentSegment.y;
            const segDist = Math.sqrt(segDx*segDx + segDy*segDy);
            const overlap = SNAKE_BODY_SEGMENT_SIZE * 0.5; // How much segments should ideally overlap or space out

            if (segDist > overlap) { // Only move if segment is too far from its leader
                 currentSegment.x += (segDx / segDist) * SNAKE_SPEED * 0.8; // Slightly slower than head
                 currentSegment.y += (segDy / segDist) * SNAKE_SPEED * 0.8;
            }
        }

        // Trim snake if it gets too long (e.g. due to aggressive mouse movements)
        // This simple trim might not be perfect for very long snakes but works for moderate length
        if (snake.length > numSegments + 1) {
            snake.pop();
        }


    }

    function checkCollision() {
        if (!gameRunning) return;

        const head = snake[0];
        // Simple AABB collision detection
        if (head.x - SNAKE_HEAD_SIZE / 2 < neonBlock.x + NEON_BLOCK_SIZE &&
            head.x + SNAKE_HEAD_SIZE / 2 > neonBlock.x &&
            head.y - SNAKE_HEAD_SIZE / 2 < neonBlock.y + NEON_BLOCK_SIZE &&
            head.y + SNAKE_HEAD_SIZE / 2 > neonBlock.y) {

            gameRunning = false;
            onCollisionSuccess();
        }
    }

    function onCollisionSuccess() {
        // alert("Robot check passed!"); // For debugging
        robotCheckContainer.style.display = 'none'; // Hide game
        loginSection.style.display = 'block';     // Show login form

        // Dispatch a custom event to let the main script know
        const event = new CustomEvent('robotCheckPassed');
        document.dispatchEvent(event);
    }

    // --- Drawing ---
    function draw() {
        if (!gameRunning) return;

        // Clear canvas
        ctx.fillStyle = '#1a252f'; // Match CSS background
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw Neon Block (as a simple rectangle for now)
        ctx.fillStyle = '#3498db'; // Neon blue
        // ctx.shadowColor = '#3498db'; // Neon glow
        // ctx.shadowBlur = 10;
        ctx.fillRect(neonBlock.x, neonBlock.y, NEON_BLOCK_SIZE, NEON_BLOCK_SIZE);
        // ctx.shadowColor = 'transparent'; // Reset shadow for other elements
        // ctx.shadowBlur = 0;


        // Draw Snake
        // Head
        ctx.fillStyle = '#2ecc71'; // Green for head
        ctx.beginPath();
        ctx.arc(snake[0].x, snake[0].y, SNAKE_HEAD_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();

        // Body Segments
        ctx.fillStyle = '#27ae60'; // Darker green for body
        for (let i = 1; i < snake.length; i++) {
            ctx.beginPath();
            ctx.arc(snake[i].x, snake[i].y, SNAKE_BODY_SEGMENT_SIZE / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(draw);
    }

    // --- Game Loop ---
    function gameLoop() {
        if (!gameRunning) return;
        moveSnake();
        checkCollision();
        // Drawing is handled by its own requestAnimationFrame loop starting with draw()
        requestAnimationFrame(gameLoop);
    }

    // Start
    // Make sure images are loaded before starting if using actual images
    // For now, we draw shapes, so we can start directly.
    // let imagesLoaded = 0;
    // const totalImages = 3; // If using head, body, block images
    // function onImageLoad() {
    //     imagesLoaded++;
    //     if (imagesLoaded === totalImages) {
    //         draw(); // Start drawing loop
    //         gameLoop(); // Start game logic loop
    //     }
    // }
    // snakeHeadImg.onload = onImageLoad;
    // snakeBodyImg.onload = onImageLoad;
    // neonBlockImg.onload = onImageLoad;
    // if (totalImages === 0) { // If not using images
        draw();
        gameLoop();
    // }
});
