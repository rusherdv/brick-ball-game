const button = document.querySelector('#startGame')
const score = document.querySelector('#score')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// General Settings

const width_resolution = 548
const height_resolution = 400
const paddle_sens = 7
const paddle_width = 75
const ball_velocity = 5
const fps = 100

// Canvas settings

let gameOver = false;
let counter = 0

canvas.width = width_resolution
canvas.height = height_resolution

function cleanCanvas(){
    ctx.clearRect(0,0, canvas.width, canvas.height)
}

// Ball Settings

const ballRadius = 4;
let x = canvas.width / 2
let y = canvas.height - 30
let dx = ball_velocity
let dy = -2

function drawBall(){
    ctx.beginPath()
    ctx.arc(x,y, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.closePath()
}

function ballMovement(){

    if(
        x + dx > canvas.width - ballRadius ||
        x + dx < ballRadius
    ){
        dx = -dx
    }

    if(y + dy < ballRadius){
        dy = -dy
    }

    const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth

    const isBallTouchingPaddle = y + dy > paddleY && y < paddleY + paddleHeight

    if(isBallSameXAsPaddle && isBallTouchingPaddle){
        dy = -dy
    }else if(y + dy > canvas.height - ballRadius){
        gameOver = true
        score.innerText = "Game over"
    }

    x += dx
    y += dy
}

function collisionDetection(){
    for (let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++){
            const currentBrick = bricks[c][r]
            if(currentBrick.status == brickStatus.destroyed)
                continue;
        
            const isBallSameXAsBrick = x > currentBrick.x && x < currentBrick.x + brickWidth
            const isBallSameYAsBrick = y > currentBrick.y && y < currentBrick.y + brickHeight
            if(isBallSameXAsBrick && isBallSameYAsBrick){
                dy = -dy
                currentBrick.status = brickStatus.destroyed
                counter++
                setScore()
            }
        }
    }
}

// Paddle Settings

const paddleHeight = 10;
const paddleWidth = paddle_width;
let paddleX = (canvas.width - paddleWidth) / 2
let paddleY = canvas.height - paddleHeight - 10
let rightPressed = false
let leftPressed = false

function drawPaddle(){
    // Definir el radio de los bordes redondeados
    var borderRadius = 5;
    
    // Dibujar el rectángulo con bordes redondeados
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(paddleX + borderRadius, paddleY);
    ctx.lineTo(paddleX + paddleWidth - borderRadius, paddleY);
    ctx.quadraticCurveTo(paddleX + paddleWidth, paddleY, paddleX + paddleWidth, paddleY + borderRadius);
    ctx.lineTo(paddleX + paddleWidth, paddleY + paddleHeight - borderRadius);
    ctx.quadraticCurveTo(paddleX + paddleWidth, paddleY + paddleHeight, paddleX + paddleWidth - borderRadius, paddleY + paddleHeight);
    ctx.lineTo(paddleX + borderRadius, paddleY + paddleHeight);
    ctx.quadraticCurveTo(paddleX, paddleY + paddleHeight, paddleX, paddleY + paddleHeight - borderRadius);
    ctx.lineTo(paddleX, paddleY + borderRadius);
    ctx.quadraticCurveTo(paddleX, paddleY, paddleX + borderRadius, paddleY);
    ctx.closePath();
    ctx.fill();
}

function paddleMovement(){
    if(rightPressed && paddleX < canvas.width - paddleWidth){
        paddleX += paddle_sens
    }else if (leftPressed && paddleX > 0){
        paddleX -= paddle_sens
    }
}

// Bricks Settings

const brickRowCount = 6;
const brickColumnCount = 10;
const brickWidth = 50;
const brickHeight = 15;
const brickPadding = 2;
const brickOffsetTop = 50;
const brickOffsetLeft = 16;
const bricks = [];

const brickStatus = {
    active: 1,
    destroyed: 0
}

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = []
    for(let r = 0; r < brickRowCount; r++){
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop
        const colors = ['blue','red', 'yellow', 'green', 'pink', 'cyan']
        const randomIndex = Math.floor(Math.random() * colors.length)
        const randomColor = colors[randomIndex]
        bricks[c][r] = { x: brickX, y: brickY, status: brickStatus.active, color: randomColor}
    }
}

function drawBricks(){
    for (let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++){
            const currentBrick = bricks[c][r]
            if(currentBrick.status == brickStatus.destroyed)
                continue;
                ctx.fillStyle = currentBrick.color;
                const borderRadius = 6
                ctx.beginPath();
                ctx.moveTo(currentBrick.x + borderRadius, currentBrick.y);
                ctx.lineTo(currentBrick.x + brickWidth - borderRadius, currentBrick.y);
                ctx.quadraticCurveTo(currentBrick.x + brickWidth, currentBrick.y, currentBrick.x + brickWidth, currentBrick.y + borderRadius);
                ctx.lineTo(currentBrick.x + brickWidth, currentBrick.y + brickHeight - borderRadius);
                ctx.quadraticCurveTo(currentBrick.x + brickWidth, currentBrick.y + brickHeight, currentBrick.x + brickWidth - borderRadius, currentBrick.y + brickHeight);
                ctx.lineTo(currentBrick.x + borderRadius, currentBrick.y + brickHeight);
                ctx.quadraticCurveTo(currentBrick.x, currentBrick.y + brickHeight, currentBrick.x, currentBrick.y + brickHeight - borderRadius);
                ctx.lineTo(currentBrick.x, currentBrick.y + borderRadius);
                ctx.quadraticCurveTo(currentBrick.x, currentBrick.y, currentBrick.x + borderRadius, currentBrick.y);
                ctx.closePath();
                ctx.fill();
                
        }
    }
}

// Main Functions

function initEvents(){
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)

    function keyDownHandler (event){
        const { key } = event

        if(key == 'Right' || key == 'ArrowRight' || key == 'd'){
            rightPressed = true
        }else if(key == 'Left' || key == 'ArrowLeft' || key == 'a'){
            leftPressed = true
        }
    }

    function keyUpHandler (event){
        const { key } = event

        if(key == 'Right' || key == 'ArrowRight' || key == 'd'){
            rightPressed = false
        }else if(key == 'Left' || key == 'ArrowLeft' || key == 'a'){
            leftPressed = false
        }
    }
}

let msPrev = window.performance.now()
let msFPSPrev = window.performance.now() + 1000;
const msPerFrame = 1000 / fps
let frames = 0
let framesPerSec = fps;

function draw(){
    if(!gameOver){
        window.requestAnimationFrame(draw)

        const msNow = window.performance.now()
        const msPassed = msNow - msPrev
    
        if (msPassed < msPerFrame) return
    
        const excessTime = msPassed % msPerFrame
        msPrev = msNow - excessTime
    
        frames++
    
        if (msFPSPrev < msNow)
        {
          msFPSPrev = window.performance.now() + 1000
          framesPerSec = frames;
          frames = 0;
        }
        
        cleanCanvas()
        
        drawBall()
        drawPaddle()
        drawBricks()
    
        collisionDetection()
        ballMovement()
        paddleMovement()
    }
}

button.addEventListener('click', () => {
    if(gameOver){
        resetGame()
    }
    draw()
    initEvents()
})

function setScore() {
    score.innerText = counter
}

function resetGame() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = ball_velocity;
    dy = -2;
    paddleX = (canvas.width - paddleWidth) / 2;
    paddleY = canvas.height - paddleHeight - 10;
    rightPressed = false;
    leftPressed = false;
    gameOver = false;
    counter = 0
    setScore()

    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            const colors = ['blue','red', 'yellow', 'green', 'pink', 'cyan']
            const randomIndex = Math.floor(Math.random() * colors.length)
            const randomColor = colors[randomIndex]
            bricks[c][r] = { x: brickX, y: brickY, status: brickStatus.active, color: randomColor };
        }
    }
}
