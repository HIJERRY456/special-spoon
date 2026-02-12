// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player object
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    speed: 5,
    velocityX: 0,
    velocityY: 0,
    trail: []
};

// Keyboard input
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Update player position
function updatePlayer() {
    let moving = false;

    // Arrow key controls
    if (keys['ArrowUp']) {
        player.velocityY = -player.speed;
        moving = true;
    } else if (keys['ArrowDown']) {
        player.velocityY = player.speed;
        moving = true;
    } else {
        player.velocityY = 0;
    }

    if (keys['ArrowLeft']) {
        player.velocityX = -player.speed;
        moving = true;
    } else if (keys['ArrowRight']) {
        player.velocityX = player.speed;
        moving = true;
    } else {
        player.velocityX = 0;
    }

    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Boundary collision (solid - bounce off edges)
    if (player.x - player.radius < 0) {
        player.x = player.radius;
        player.velocityX = 0;
    }
    if (player.x + player.radius > canvas.width) {
        player.x = canvas.width - player.radius;
        player.velocityX = 0;
    }
    if (player.y - player.radius < 0) {
        player.y = player.radius;
        player.velocityY = 0;
    }
    if (player.y + player.radius > canvas.height) {
        player.y = canvas.height - player.radius;
        player.velocityY = 0;
    }

    // Add to trail when moving
    if (moving) {
        player.trail.push({
            x: player.x,
            y: player.y,
            alpha: 1
        });
    }

    // Limit trail length and fade out
    if (player.trail.length > 30) {
        player.trail.shift();
    }

    // Fade trail
    for (let i = 0; i < player.trail.length; i++) {
        player.trail[i].alpha -= 0.03;
    }

    // Remove fully faded trail
    player.trail = player.trail.filter(t => t.alpha > 0);
}

// Draw functions
function drawTrail() {
    for (let i = 0; i < player.trail.length; i++) {
        const point = player.trail[i];
        const trailRadius = player.radius * 0.6;
        
        ctx.fillStyle = `rgba(0, 255, 255, ${point.alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, trailRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawPlayer() {
    // Draw solid cyan ball
    ctx.fillStyle = '#00FFFF';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();

    // Add a darker outline for better visibility
    ctx.strokeStyle = '#00AA00';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw trail first (behind player)
    drawTrail();

    // Draw player on top
    drawPlayer();
}

// Game loop
function gameLoop() {
    updatePlayer();
    drawGame();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();