// FLAPPY BIRD -- THE GAME
//board
let board = document.getElementById('board')
let boardWidth = 360;  
let boardHeight = 640;  // the background-image has exactly these dimensions
let context


//bird
let birdWidth = 34 // width/height ratio = 408/228 = 17/12
let birdHeight = 24
let birdX = boardWidth/8
let birdY = boardHeight/2
let birdImg

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = []
let pipeWidth = 64 // width/height ratio = 384/3072 = 1/8, 512/64 = 1/8
let pipeHeight = 512
let pipeX = boardWidth // starting point for drawing the pipes is (360, 0), up in the right corner
let pipeY = 0

let topPipeImg
let bottomPipeImg


//physics
let velocityX = -2 // pipes moving left speed
let velocityY = 0 // bird jump speed
let gravity = 0.4

let gameOver = false
let score = 0
if (!localStorage.highScore){
    localStorage.highScore = 0
}

window.onload = function(){
    board = document.getElementById('board')
    board.height = boardHeight
    board.width = boardWidth
    context = board.getContext('2d') // used for drawing on the board (?)

    // draw flappy bird

    // load images
    birdImg = new Image()
    birdImg.src = "../Bilder/flappybird.png"
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)
    }

    topPipeImg = new Image()
    topPipeImg.src = "../Bilder/toppipe.png"

    bottomPipeImg = new Image()
    bottomPipeImg.src = "../Bilder/bottompipe.png"

    requestAnimationFrame(update)
    setInterval(placePipes, 1500) //every 1.5 seconds
}
document.addEventListener('keydown', moveBird)


function update() {
    requestAnimationFrame(update)
    // to clear the previous frame
    if (gameOver) {
        return 
    }
    context.clearRect(0, 0, board.width, board.height)

    // we are going to draw the bird over and over again for each frame
    velocityY += gravity
    // bird.y += velocityY
    bird.y = Math.max(bird.y + velocityY, 0) // apply gravity to current bird.y, limit the bird.y to top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)

    if (bird.y > board.height) {
        gameOver = true
    }

    //pipes
    for (let i=0; i<pipeArray.length; i++) {
        let pipe = pipeArray[i]
        pipe.x += velocityX
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
           score += 0.5 // because there are two pipes, 0.5*2 = 1
           /* soundEffects() */
           pipe.passed = true
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) { // -pipeWidth is the right side of the pipe
        pipeArray.shift() //removes first element from the array
    }

    //score
    context.fillStyle = "white"
    context.font = "45px sans-serif"
    context.fillText(score, 5, 45)

    if (gameOver) {
        console.log(score)
        if (score > Number(localStorage.highScore)){
            localStorage.highScore = score
        }
        console.log(localStorage.highScore)
        setTimeout(backtoStart, 800)
    }
}

function placePipes() {
    if (gameOver) {
        return
    }

    // (0-1) * pipeHeight/2
    // 0 -> -128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight

    /* the Y position of the pipe will now range from negative 1/4 to negative 3/4 of the pipe-height, somewhere between that */

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2)
    let openingSpace = board.height/4
    
    // shifting the pipe 128px upwards
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false // if the flappybird has passed this pipe yet
    }

    pipeArray.push(topPipe)

    let bottomPipe = {
        img : bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe)
}



function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //jump
        velocityY = -6
    }
}

document.addEventListener('click', () => {
    velocityY = -6
})

function backtoStart(){
    window.location.href = '../HTML/gameover.html';
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}

// prevents page from scrolling when space bar is pressed
window.addEventListener('keydown', function(e){
    if(e.keyCode == 32 && e.target == document.body) { 
        e.preventDefault();
      }
})

