// script.js
const gameContainer = document.getElementById("game-container");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");

let playerPosition = 180;
let gameSpeed = 5;
let score = 0;
let isGameRunning = true;
let obstacleFrequency = 1000; // Time in milliseconds

// Audio effects
const pointSound = new Audio("point.mp3"); // Replace with actual path to your sound file
const gameOverSound = new Audio("gameover.mp3");

// Move player
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && playerPosition > 0) {
        playerPosition -= 20;
    } else if (e.key === "ArrowRight" && playerPosition < 360) {
        playerPosition += 20;
    }
    player.style.left = `${playerPosition}px`;
});

// Create a new obstacle
function createObstacle() {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.left = `${Math.floor(Math.random() * 360)}px`;
    obstacle.style.top = `-40px`;
    gameContainer.appendChild(obstacle);
    moveObstacle(obstacle);
}

// Move obstacles and detect collision
function moveObstacle(obstacle) {
    const interval = setInterval(() => {
        const obstacleTop = parseInt(obstacle.style.top);
        const obstacleLeft = parseInt(obstacle.style.left);
        const playerLeft = parseInt(player.style.left);

        // Collision detection
        if (
            obstacleTop > 540 &&
            obstacleTop < 600 &&
            obstacleLeft < playerLeft + 40 &&
            obstacleLeft + 40 > playerLeft
        ) {
            isGameRunning = false;
            gameOverSound.play();
            alert(`Game Over! Pontuação final: ${score}`);
            clearInterval(interval);
            location.reload();
        }

        // Move obstacle or remove it
        if (obstacleTop > 600) {
            clearInterval(interval);
            obstacle.remove();
            score++;
            pointSound.play();
            scoreDisplay.textContent = `Pontos: ${score}`;
            increaseDifficulty();
        } else {
            obstacle.style.top = `${obstacleTop + gameSpeed}px`;
        }
    }, 30);
}

// Increase game difficulty
function increaseDifficulty() {
    if (score % 5 === 0) {
        gameSpeed += 1; // Increase speed every 5 points
        obstacleFrequency = Math.max(500, obstacleFrequency - 50); // Faster obstacle generation
    }
}

// Game loop
function gameLoop() {
    if (isGameRunning) {
        createObstacle();
        setTimeout(gameLoop, obstacleFrequency);
    }
}

// Start the game
gameLoop();
