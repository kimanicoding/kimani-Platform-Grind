const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 10;
const paddleSpeed = 7;
const ballSpeed = 5;

// Paddle positions
let player1Y = canvas.height / 2 - paddleHeight / 2;
let player2Y = canvas.height / 2 - paddleHeight / 2;

// Ball properties
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = ballSpeed;
let ballSpeedY = ballSpeed;

// Score
let player1Score = 0;
let player2Score = 0;

// Key states
const keys = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false
};

// Event listeners for key presses
document.addEventListener('keydown', (e) => {
  if (e.key === 'w' || e.key === 'W') keys.w = true;
  if (e.key === 's' || e.key === 'S') keys.s = true;
  if (e.key === 'ArrowUp') keys.ArrowUp = true;
  if (e.key === 'ArrowDown') keys.ArrowDown = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'w' || e.key === 'W') keys.w = false;
  if (e.key === 's' || e.key === 'S') keys.s = false;
  if (e.key === 'ArrowUp') keys.ArrowUp = false;
  if (e.key === 'ArrowDown') keys.ArrowDown = false;
});

// Draw game objects
function draw() {
  // Clear canvas
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw center line
  ctx.setLineDash([5, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Draw paddles
  ctx.fillStyle = '#fff';
  ctx.fillRect(20, player1Y, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - 30, player2Y, paddleWidth, paddleHeight);
  
  // Draw ball
  ctx.fillRect(ballX, ballY, ballSize, ballSize);
  
  // Draw scores
  ctx.font = '30px Arial';
  ctx.fillText(player1Score, canvas.width / 4, 40);
  ctx.fillText(player2Score, 3 * canvas.width / 4, 40);
}

// Update game state
function update() {
  // Move player 1 (WASD)
  if (keys.w && player1Y > 0) {
    player1Y -= paddleSpeed;
  }
  if (keys.s && player1Y < canvas.height - paddleHeight) {
    player1Y += paddleSpeed;
  }
  
  // Move player 2 (Arrow keys)
  if (keys.ArrowUp && player2Y > 0) {
    player2Y -= paddleSpeed;
  }
  if (keys.ArrowDown && player2Y < canvas.height - paddleHeight) {
    player2Y += paddleSpeed;
  }
  
  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  
  // Ball collision with top and bottom walls
  if (ballY <= 0 || ballY >= canvas.height - ballSize) {
    ballSpeedY = -ballSpeedY;
  }
  
  // Ball collision with paddles
  // Player 1 paddle
  if (
    ballX <= 30 && 
    ballY + ballSize >= player1Y && 
    ballY <= player1Y + paddleHeight
  ) {
    ballSpeedX = Math.abs(ballSpeedX);
    // Add some angle based on where the ball hits the paddle
    const hitPosition = (ballY - player1Y) / paddleHeight;
    ballSpeedY = (hitPosition - 0.5) * 10;
  }
  
  // Player 2 paddle
  if (
    ballX >= canvas.width - 40 && 
    ballY + ballSize >= player2Y && 
    ballY <= player2Y + paddleHeight
  ) {
    ballSpeedX = -Math.abs(ballSpeedX);
    // Add some angle based on where the ball hits the paddle
    const hitPosition = (ballY - player2Y) / paddleHeight;
    ballSpeedY = (hitPosition - 0.5) * 10;
  }
  
  // Scoring
  if (ballX < 0) {
    player2Score++;
    resetBall();
  }
  if (ballX > canvas.width) {
    player1Score++;
    resetBall();
  }
}

// Reset ball to center
function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = (Math.random() * 4) - 2; // Random vertical direction
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
