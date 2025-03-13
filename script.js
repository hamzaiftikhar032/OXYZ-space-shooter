// Get the canvas element
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Define the player properties
let player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5,
    lives: 3,
    score: 0
};

// Define the enemy properties
let enemies = [];
let enemySpawnInterval = 200; // 1 second
let enemySpeed = 2;

// Define the bullet properties
let bullets = [];
let bulletSpeed = 5;

// Define the game states
let gameState = 'start';
let gameOver = false;

// Draw the player
function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw the enemies
function drawEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        ctx.fillStyle = 'red';
        ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
    }
}

// Draw the bullets
function drawBullets() {
    for (let i = 0; i < bullets.length; i++) {
        ctx.fillStyle = 'green';
        ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
    }
}

// Update the game state
function updateGameState() {
    // Update the player position
    if (gameState === 'playing') {
        if (rightPressed) {
            player.x += player.speed;
        }
        if (leftPressed) {
            player.x -= player.speed;
        }

        // Keep the player within the canvas bounds
        if (player.x < 0) {
            player.x = 0;
        }
        if (player.x > canvas.width - player.width) {
            player.x = canvas.width - player.width;
        }

        // Update the enemy positions
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].y += enemySpeed;

            // Check if the enemy has reached the bottom of the canvas
            if (enemies[i].y > canvas.height) {
                player.lives--;
                enemies.splice(i, 1);
            }
        }

        // Update the bullet positions
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].y -= bulletSpeed;

            // Check if the bullet has gone off the top of the canvas
            if (bullets[i].y < 0) {
                bullets.splice(i, 1);
            }
        }

        // Check for collisions between bullets and enemies
        for (let i = 0; i < bullets.length; i++) {
            for (let j = 0; j < enemies.length; j++) {
                if (bullets[i].x + bullets[i].width > enemies[j].x &&
                    bullets[i].x < enemies[j].x + enemies[j].width &&
                    bullets[i].y + bullets[i].height > enemies[j].y &&
                    bullets[i].y < enemies[j].y + enemies[j].height) {
                    player.score++;
                    enemies.splice(j, 1);
                    bullets.splice(i, 1);
                }
            }
        }

        // Check if the game is over
        if (player.lives <= 0) {
            gameOver = true;
            gameState = 'gameOver';
        }
    }
}



// Draw the game
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'start') {
        ctx.font = '24px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Press Space to start', canvas.width / 2, canvas.height / 2);
    } else if (gameState === 'playing') {
        drawPlayer();
        drawEnemies();
        drawBullets();

        // ctx.font = '18px Arial';
        // ctx.fillStyle = 'black';
        // ctx.textAlign = 'left';
        // ctx.textBaseline = 'top';
        // ctx.fillText('Lives: ' + player.lives, 10, 10);
        // ctx.fillText('Score: ' + player.score, 10, 30);
    } else if (gameState === 'gameOver') {
        ctx.font = '24px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Game Over! Final Score: ' + player.score, canvas.width / 2, canvas.height / 2);
    }
}

// Handle keyboard input
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        rightPressed = true;
    }
    if (e.key === 'ArrowLeft') {
        leftPressed = true;
    }
    if (e.key === ' ') {
        spacePressed = true;
        if (gameState === 'start') {
            gameState = 'playing';
        } else if (gameState === 'playing') {
            bullets.push({
                x: player.x + player.width / 2 - 5,
                y: player.y,
                width: 10,
                height: 10
            });
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') {
        rightPressed = false;
    }
    if (e.key === 'ArrowLeft') {
        leftPressed = false;
    }
    if (e.key === ' ') {
        spacePressed = false;
    }
});

// Scoring and Lives
function updateScoreAndLives() {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Score: ' + player.score, 10, 10);
    ctx.fillText('Lives: ' + player.lives, 10, 40);
}

// Game Over Screen
function drawGameOverScreen() {
    ctx.font = '48px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
    ctx.font = '24px Arial';
    ctx.fillText('Final Score: ' + player.score, canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 100);
}


function checkCollisions() {
    for (let i = 0; i < enemies.length; i++) {
        for (let j = i + 1; j < enemies.length; j++) {
            if (enemies[i].x + enemies[i].width > enemies[j].x &&
                enemies[i].x < enemies[j].x + enemies[j].width &&
                enemies[i].y + enemies[i].height > enemies[j].y &&
                enemies[i].y < enemies[j].y + enemies[j].height) {
                // remove overlapping enemies
                enemies.splice(j, 1);
                j--;
            }
        }
    }
}



// Main Game Loop
setInterval(() => {
    updateGameState();
    drawGame();
    checkCollisions();
    updateScoreAndLives();
}, 16);

// Enemy Spawning
setInterval(() => {
    if (gameState === 'playing') {
        const enemySpawnChance = 0.5; // 50% chance of spawning an enemy
        if (Math.random() < enemySpawnChance) {
            const enemyX = Math.random() * (canvas.width - 50);
            const enemyY = 0;
            enemies.push({
                x: enemyX,
                y: enemyY,
                width: 50,
                height: 50
            });
        }
    }
}, 800); // spawn enemies every 0.5 seconds

