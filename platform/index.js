// Game variables
const gameCanvas = document.getElementById('gameCanvas');
const scoreElement = document.getElementById('scoreValue');
let score = 0;
let gameRunning = true;

// Player properties
const player = {
    x: 50,
    y: 300,
    width: 40,
    height: 40,
    speed: 5,
    velX: 0,
    velY: 0,
    jumping: false,
    grounded: false
};

// Game objects
const platforms = [
    {x: 0, y: 450, width: 800, height: 50}, // Ground
    {x: 200, y: 350, width: 100, height: 20},
    {x: 400, y: 300, width: 100, height: 20},
    {x: 600, y: 250, width: 100, height: 20},
    {x: 300, y: 200, width: 100, height: 20}
];

const obstacles = [
    {x: 300, y: 430, width: 30, height: 20},
    {x: 500, y: 280, width: 30, height: 20},
    {x: 700, y: 230, width: 30, height: 20}
];

const goal = {
    x: 750,
    y: 200,
    width: 30,
    height: 50
};

// Key state tracking
const keys = {};

// Initialize game
function init() {
    createPlayer();
    createPlatforms();
    createObstacles();
    createGoal();
    
    // Event listeners
    window.addEventListener('keydown', function(e) {
        keys[e.key] = true;
    });
    
    window.addEventListener('keyup', function(e) {
        keys[e.key] = false;
    });
    
    // Start game loop
    requestAnimationFrame(gameLoop);
}

// Create player element
function createPlayer() {
    const playerElement = document.createElement('div');
    playerElement.className = 'player';
    playerElement.id = 'player';
    gameCanvas.appendChild(playerElement);
}

// Create platforms
function createPlatforms() {
    platforms.forEach(platform => {
        const platformElement = document.createElement('div');
        platformElement.className = 'platform';
        platformElement.style.left = platform.x + 'px';
        platformElement.style.top = platform.y + 'px';
        platformElement.style.width = platform.width + 'px';
        platformElement.style.height = platform.height + 'px';
        gameCanvas.appendChild(platformElement);
    });
}

// Create obstacles
function createObstacles() {
    obstacles.forEach(obstacle => {
        const obstacleElement = document.createElement('div');
        obstacleElement.className = 'obstacle';
        obstacleElement.style.left = obstacle.x + 'px';
        obstacleElement.style.top = obstacle.y + 'px';
        obstacleElement.style.width = obstacle.width + 'px';
        obstacleElement.style.height = obstacle.height + 'px';
        gameCanvas.appendChild(obstacleElement);
    });
}

// Create goal
function createGoal() {
    const goalElement = document.createElement('div');
    goalElement.className = 'goal';
    goalElement.style.left = goal.x + 'px';
    goalElement.style.top = goal.y + 'px';
    goalElement.style.width = goal.width + 'px';
    goalElement.style.height = goal.height + 'px';
    gameCanvas.appendChild(goalElement);
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;
    
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Apply gravity
    player.velY += 0.5;
    
    // Handle key presses
    if (keys['a'] || keys['A']) {
        player.velX = -player.speed;
    } else if (keys['d'] || keys['D']) {
        player.velX = player.speed;
    } else {
        player.velX = 0;
    }
    
    if ((keys['w'] || keys['W']) && !player.jumping && player.grounded) {
        player.velY = -12;
        player.jumping = true;
        player.grounded = false;
    }
    
    // Update player position
    player.x += player.velX;
    player.y += player.velY;
    
    // Boundary checks
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > 800) player.x = 800 - player.width;
    
    // Reset grounded state
    player.grounded = false;
    
    // Platform collision
    platforms.forEach(platform => {
        const direction = collisionCheck(player, platform);
        
        if (direction === "left" || direction === "right") {
            player.velX = 0;
        } else if (direction === "bottom") {
            player.grounded = true;
            player.jumping = false;
        } else if (direction === "top") {
            player.velY *= -0.5; // Bounce effect
        }
    });
    
    // Obstacle collision
    obstacles.forEach(obstacle => {
        if (collisionCheck(player, obstacle)) {
            // Reset player position
            player.x = 50;
            player.y = 300;
            player.velX = 0;
            player.velY = 0;
            score = Math.max(0, score - 10);
            scoreElement.textContent = score;
        }
    });
    
    // Goal collision
    if (collisionCheck(player, goal)) {
        score += 100;
        scoreElement.textContent = score;
        // Reset player position
        player.x = 50;
        player.y = 300;
        player.velX = 0;
        player.velY = 0;
    }
    
    // Check if player fell off the screen
    if (player.y > 500) {
        player.x = 50;
        player.y = 300;
        player.velX = 0;
        player.velY = 0;
        score = Math.max(0, score - 10);
        scoreElement.textContent = score;
    }
}

// Simple collision detection
function collisionCheck(obj1, obj2) {
    const vX = (obj1.x + obj1.width/2) - (obj2.x + obj2.width/2);
    const vY = (obj1.y + obj1.height/2) - (obj2.y + obj2.height/2);
    
    // Combine half widths and half heights
    const hWidths = (obj1.width/2) + (obj2.width/2);
    const hHeights = (obj1.height/2) + (obj2.height/2);
    
    let direction = null;
    
    // Check if collision occurred
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // Calculate collision direction
        const oX = hWidths - Math.abs(vX);
        const oY = hHeights - Math.abs(vY);
        
        if (oX >= oY) {
            if (vY > 0) {
                direction = "top";
                obj1.y += oY;
            } else {
                direction = "bottom";
                obj1.y -= oY;
            }
        } else {
            if (vX > 0) {
                direction = "left";
                obj1.x += oX;
            } else {
                direction = "right";
                obj1.x -= oX;
            }
        }
    }
    
    return direction;
}

// Render game objects
function render() {
    const playerElement = document.getElementById('player');
    playerElement.style.left = player.x + 'px';
    playerElement.style.top = player.y + 'px';
}

// Start the game
init();
