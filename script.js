const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");


// Responsive canvas size
canvas.width = 360;
canvas.height = 310;

// Game variables
const boxSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = {
    x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
};
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameInterval;

// Update scoreboard
document.getElementById("score").textContent = score;
document.getElementById("highScore").textContent = highScore;

// Draw snake
function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#ffd369" : "#f8b400"; // Head and body colors
        ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
        ctx.strokeStyle = "#222831";
        ctx.strokeRect(segment.x, segment.y, boxSize, boxSize);
    });
}

// Draw food
function drawFood() {
    ctx.fillStyle = "#ff4747"; // Food color
    ctx.beginPath();
    ctx.arc(food.x + boxSize / 2, food.y + boxSize / 2, boxSize / 2, 0, Math.PI * 2);
    ctx.fill();
}

// Update snake
function updateSnake() {
    const head = { ...snake[0] };

    if (direction === "UP") head.y -= boxSize;
    if (direction === "DOWN") head.y += boxSize;
    if (direction === "LEFT") head.x -= boxSize;
    if (direction === "RIGHT") head.x += boxSize;

    snake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").textContent = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            document.getElementById("highScore").textContent = highScore;
        }

        food = {
            x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
            y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
        };
    } else {
        snake.pop();
    }

    // Check collision
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        clearInterval(gameInterval);
        alert(`Game Over! Your score: ${score}`);
        location.reload();
    }
}

// Handle input
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Touch controls
document.getElementById("up").addEventListener("click", () => {
    if (direction !== "DOWN") direction = "UP";
});
document.getElementById("down").addEventListener("click", () => {
    if (direction !== "UP") direction = "DOWN";
});
document.getElementById("left").addEventListener("click", () => {
    if (direction !== "RIGHT") direction = "LEFT";
});
document.getElementById("right").addEventListener("click", () => {
    if (direction !== "LEFT") direction = "RIGHT";
});

// Start Game
startButton.addEventListener("click", () => {
    startButton.style.display = "none"; // Hide the start button
    gameInterval = setInterval(gameLoop, 150); // Start the game
});

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
    updateSnake();
}
