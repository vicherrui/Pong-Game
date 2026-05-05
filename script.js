const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const paddleWidth = 10;
const paddleHeight = 100;

// Players
const player1 = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2
};

const enemy = {
    x: canvas.width - 20,
    y: canvas.height / 2 - paddleHeight / 2
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 4,
    vy: 4,
    radius: 5
};

// SCORE (cargado desde localStorage)
let ScorePlayer = parseInt(localStorage.getItem("ScorePlayer")) || 0;
let ScoreEnemy = parseInt(localStorage.getItem("ScoreEnemy")) || 0;

// Draw
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(ScorePlayer, canvas.width / 4, 50);
    ctx.fillText(ScoreEnemy, (canvas.width / 4) * 3, 50);

    ctx.fillRect(player1.x, player1.y, paddleWidth, paddleHeight);
    ctx.fillRect(enemy.x, enemy.y, paddleWidth, paddleHeight);

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

// Update
function update() {

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
        ball.vy *= -1;
    }

    // Player collision
    if (
        ball.x - ball.radius <= player1.x + paddleWidth &&
        ball.y >= player1.y &&
        ball.y <= player1.y + paddleHeight
    ) {
        ball.vx = Math.abs(ball.vx);
        ball.vy += (Math.random() - 0.5) * 2;
    }

    // Enemy collision
    if (
        ball.x + ball.radius >= enemy.x &&
        ball.y >= enemy.y &&
        ball.y <= enemy.y + paddleHeight
    ) {
        ball.vx = -Math.abs(ball.vx);
        ball.vy += (Math.random() - 0.5) * 2;
    }

    enemy.y += (ball.y - enemy.y) * 0.05;

    player1.y = Math.max(0, Math.min(canvas.height - paddleHeight, player1.y));

    checkGameOver();

    draw();
    requestAnimationFrame(update);
}

update();

// Controls
window.addEventListener('keydown', (e) => { 
    if (e.key === 'ArrowUp') player1.y -= 70;
    if (e.key === 'ArrowDown') player1.y += 70;
});

// Reset
function resetGame() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 4;
    ball.vy = 4;

    player1.y = canvas.height / 2 - paddleHeight / 2;
    enemy.y = canvas.height / 2 - paddleHeight / 2;
}

// Game Over + Score
function checkGameOver() {

    if (ball.x - ball.radius <= 0) {
        ScoreEnemy++;
        resetGame();
        saveScore();
        return;
    }

    if (ball.x + ball.radius >= canvas.width) {
        ScorePlayer++;
        resetGame();
        saveScore();
        return;
    }

    // ✔ CORREGIDO (victoria a 50 puntos)
    if (ScorePlayer >= 50 || ScoreEnemy >= 50) {
        ScorePlayer = 0;
        ScoreEnemy = 0;
        saveScore();
        resetGame();
    }
}

// Local Storage
function saveScore() {
    localStorage.setItem("ScorePlayer", ScorePlayer);
    localStorage.setItem("ScoreEnemy", ScoreEnemy);
}