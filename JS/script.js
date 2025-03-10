const grid = document.getElementById('grid');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const pauseMenu = document.getElementById('pause-menu');
const continueBtn = document.getElementById('continue-btn');
const restartBtn = document.getElementById('restart-btn');
const fpsDisplay = document.getElementById('fps'); 
const nextBlockGrid = document.getElementById('next-tetromino');
const container = document.getElementById('container');
const gridContainer = document.getElementById('game-container');
const gameOverDisplay = document.getElementById('gameOver');
const overtimerDisplay = document.getElementById('timer2');
const overscoreDisplay = document.getElementById('score2');
const playerName = localStorage.getItem('name'); // Retrieve the player's name

const rows = 20;
const cols = 10;

let score = 0;
let lives = 1;
let isPaused = false;
let isOver = false;
let lastTime = 0;
let frameCount = 0;

let currentBlock;
let currentPosition = { x: 4, y: 0 };

let nextBlock = null;



const blocks = [
    { shape: [[1, 1, 1, 1]], color: 'cyan' }, // I -> Cyan
    { shape: [[1, 1], [1, 1]], color: 'orange' }, // O -> Orange
    { shape: [[0, 1, 0], [1, 1, 1]], color: 'purple' }, // T -> Purple
    { shape: [[1, 0, 0], [1, 1, 1]], color:'green' }, // L -> Green
    { shape: [[0, 0, 1], [1, 1, 1]], color: 'blue' }, // J -> Blue
    { shape: [[0, 1, 1], [1, 1, 0]], color: 'yellow' }, // S -> Yellow
    { shape: [[1, 1, 0], [0, 1, 1]], color: 'red' }, // Z -> Red
];
const colors = ['cyan','orange', 'purple','green','blue','yellow','red'];

//this creates the base grid for the game by creating a div for each block.
function createGrid() {
    for (let i = 0; i < rows * cols; i++) {
        const div = document.createElement('div');
        grid.appendChild(div);
    }
}

function checkColor(color){
    return colors.includes(color);
}

//draws the blocks with its assigned color
function drawBlock() {
    currentBlock.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const index = (currentPosition.y + y) * cols + (currentPosition.x + x);
                grid.children[index].style.backgroundColor = currentColor;
            }
        });
    });
}

//removes the block by reseting the color back to the original grid color.
function undrawBlock() {
    currentBlock.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const index = (currentPosition.y + y) * cols + (currentPosition.x + x);
                grid.children[index].style.backgroundColor = 'black'; // Reset color
            }
        });
    });
}

function moveDown() {
    undrawBlock();
    currentPosition.y++;
    if (collision()) {
        currentPosition.y--;
        placeBlock();
        generateRandomBlock();
        console.log('4')
    }
    console.log('3')
    drawBlock();
}

function generateRandomBlock() {
    if (!nextBlock) {
        // If no next block, initialize it
        nextBlock = blocks[Math.floor(Math.random() * blocks.length)];
    }
    // Set current block to next block
    currentBlock = nextBlock.shape;
    currentColor = nextBlock.color;
    // Generate a new next block
    nextBlock = blocks[Math.floor(Math.random() * blocks.length)];
    currentPosition = { x: Math.floor(cols / 2) - 1, y: 0 };

    if (collision()) {
        lives = 0;
        livesDisplay.innerText = lives;
        gameOver();
    }

    updateNextBlockPreview();
}

function updateNextBlockPreview() {
    nextBlockGrid.innerHTML = ''; // Clear previous preview

    let shape = nextBlock.shape;
    let shapeWidth = shape[0].length; // Tetromino width
    let shapeHeight = shape.length; // Tetromino height

    // Fixed 6x6 grid
    let gridSize = 6;

    nextBlockGrid.style.gridTemplateColumns = `repeat(${gridSize}, 30px)`;
    nextBlockGrid.style.gridTemplateRows = `repeat(${gridSize}, 30px)`;

    // Calculate centering offsets (so Tetromino appears in the middle)
    let offsetX = Math.floor((gridSize - shapeWidth) / 2);
    let offsetY = Math.floor((gridSize - shapeHeight) / 2);

    // Create 6x6 placeholder grid, centering the Tetromino
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const div = document.createElement('div');
            div.style.width = '30px';
            div.style.height = '30px';
            div.style.backgroundColor = 'black';

            if (y >= offsetY && y < offsetY + shapeHeight && x >= offsetX && x < offsetX + shapeWidth) {
                let shapeX = x - offsetX;
                let shapeY = y - offsetY;

                if (shapeY < shape.length && shapeX < shape[shapeY].length && shape[shapeY][shapeX]) {
                    div.style.backgroundColor = nextBlock.color;
                }
            }
            nextBlockGrid.appendChild(div);
        }
    }
}

function placeBlock() {
    currentBlock.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const index = (currentPosition.y + y) * cols + (currentPosition.x + x);
                grid.children[index].style.backgroundColor = currentColor;
            }
        });
    });

    removeFullRows();
    scoreDisplay.innerText = `Score: ${score}`;
    adjustGameSpeed(); 
}

function removeFullRows() {
    let rowsCleared = 0; 
    for (let y = rows - 1; y >= 0; y--) {
        let isFull = true;
        for (let x = 0; x < cols; x++) {
            const index = y * cols + x;
            if (!checkColor(grid.children[index].style.backgroundColor)) {
                isFull = false;
                break;
            }
        }
        if (isFull) {
            // clear the full row
            for (let x = 0; x < cols; x++) {
                const index = y * cols + x;
                grid.children[index].style.backgroundColor = 'black'; // reset color
            }
           
            // shift down the rows above the cleared row
            for (let moveY = y - 1; moveY >= 0; moveY--) {
                for (let x = 0; x < cols; x++) {
                    const currentIndex = moveY * cols + x;
                    const belowIndex = (moveY + 1) * cols + x;

                    // move the block down
                    grid.children[belowIndex].style.backgroundColor = grid.children[currentIndex].style.backgroundColor;
                    grid.children[currentIndex].style.backgroundColor = 'black'; // reset moved block
                }
            }
            y++; // check the same row again since we shifted everything down
            rowsCleared++;
            console.log('Row cleared:', y);
        }
    }

    if (rowsCleared > 0) {
        if (rowsCleared > 1) {
            score += rowsCleared * 10 * 2; // double the score for clearing more than 1 row
        } else {
            score += rowsCleared * 10; // normal score for other row clears
        }
    }

    scoreDisplay.innerText = `Score: ${score}`;
    adjustGameSpeed(); // Adjust the game speed based on the score
}

function collision() {
    return currentBlock.some((row, y) => {
        return row.some((value, x) => {
            if (value) {
                const X = currentPosition.x + x;
                const Y = currentPosition.y + y;
                console.log('11') //collision found
                return (
                    //left boundary
                    X < 0 ||
                    //right boundary
                    X >= cols || 
                    //bottom boundary
                    Y >= rows ||
                    //filled block
                    (Y >= 0 &&  checkColor(grid.children[Y * cols + X].style.backgroundColor))
                );
            }
            console.log('12') // no collision found
            return false;
        });
    });
}

let startTime = performance.now(); // Track the start time
let elapsedTime = 0; // Track the total elapsed time

function updateTimer() {
    if (!isPaused) { // Update timer only if the game is not paused
        elapsedTime = Math.floor((performance.now() - startTime) / 1000);
        timerDisplay.innerText = `Time: ${elapsedTime}`;
    }
}

function togglePause() {
    isPaused = !isPaused;
    pauseMenu.style.display = isPaused ? 'block' : 'none';

    if (!isPaused) {
        startTime = performance.now() - (elapsedTime * 1000); // Adjust start time to continue from where it left off
        requestAnimationFrame(gameLoop); // Restart the game loop
    }
}

function restartGame() {
    location.reload();
}

function rotateBlock(block) {
    return block[0].map((_, index) => block.map(row => row[index]).reverse());
}

function updateFPS(currentTime) {
    frameCount++;

    if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        fpsDisplay.innerText = `FPS: ${fps}`;
        lastTime = currentTime;
        frameCount = 0;
    }
}

document.addEventListener('keydown', (event) => {
    if ((event.code === 'Escape') || (event.code === 'KeyP') ) {
        togglePause();
    }

    // stop any game activity if the game is paused or is over
    if (isPaused) return; 
    if (isOver) return; 

    if (!isPaused) {
        if ((event.code === 'ArrowLeft')||(event.code === 'KeyA')) {
            undrawBlock();
            currentPosition.x--;
            if (collision()) currentPosition.x++;
            drawBlock();
            event.preventDefault();
        }
        if ((event.code === 'ArrowRight')||(event.code === 'KeyD')) {
            undrawBlock();
            currentPosition.x++;
            if (collision()) currentPosition.x--;
            drawBlock();
            event.preventDefault();
        }
        if ((event.code === 'ArrowDown')||(event.code === 'KeyS')) {
            moveDown();
            event.preventDefault();
        }
        if ((event.code === 'ArrowUp')||(event.code === 'KeyW')) {
            undrawBlock();
            currentBlock = rotateBlock(currentBlock);
            if (collision()) {
                currentBlock = rotateBlock(currentBlock).reverse();
            }
            drawBlock();
            event.preventDefault();
        }
    }
});

continueBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', restartGame);

function updateFPSTimer() {
    frameCount++;

    // Calculate the time elapsed since the last FPS update (every second)
    if (performance.now() - lastTime >= 1000) {
        const fps = frameCount;
        fpsDisplay.innerText = `FPS: ${fps}`;
        lastTime = performance.now();
        frameCount = 0;
    }
}

function sendGameOverData() {
    const name = document.getElementById("name").textContent;
    const timer = document.getElementById("timer2").textContent;
    const score = document.getElementById("score2").textContent;

    const data = {
        name: name,
        time: timer,
        score: score
    };

    fetch('/game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function updateScoreboard() {
    fetch('/scoreboard')
        .then(response => response.json())
        .then(scores => {

            const scoreboardBody = document.getElementById("scoreboardBody");

            scoreboardBody.innerHTML = "";

            scores.forEach((player, index) => {
                const row = document.createElement("tr");

                const nameCell = document.createElement("td");
                nameCell.innerText = player.username;
                row.appendChild(nameCell);

                const timeCell = document.createElement("td");
                timeCell.innerText = player.time;
                row.appendChild(timeCell);

                const scoreCell = document.createElement("td");
                scoreCell.innerText = player.score;
                row.appendChild(scoreCell);

                scoreboardBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching scoreboard:", error));
}

function gameOver() {
    isOver = !isOver;
    gridContainer.style.display = 'none';
    container.style.display = 'none';

    document.getElementById("name").innerText = playerName;
    document.getElementById("timer2").innerText = elapsedTime;
    document.getElementById("score2").innerText = score;
    gameOverDisplay.style.display = 'flex';

    sendGameOverData(); 
    setTimeout(updateScoreboard, 500);
}

let lastFrameTime = 0;
let accumulatedTime = 0; 
let tickRate = 500; 
const speedIncreaseInterval = 100; 

function adjustGameSpeed() {
    // Decrease the tick rate (increase game speed) for every 100 points scored
    if (score % speedIncreaseInterval === 0 && score > 0) {
        tickRate = Math.max(200, tickRate - 50); 
        console.log(`Game speed increased! New tick rate: ${tickRate}ms`);
    }
}

function gameLoop(currentTime) {
    updateFPSTimer(); 

    if (isPaused || isOver) {

    requestAnimationFrame(gameLoop);
    return;
    }

    let deltaTime = currentTime - lastFrameTime;

    if (deltaTime > 1000) {
        deltaTime = tickRate;
    }

    accumulatedTime += deltaTime;

    render(); 

    while (accumulatedTime >= tickRate) {
        moveDown();
        updateTimer(); // updating the game timer
        updateFPSTimer();
        accumulatedTime -= tickRate;
    }



    lastFrameTime = currentTime;
    requestAnimationFrame(gameLoop);
} 


function render() {
    // Update the display, including FPS
    updateFPS(performance.now());
}

createGrid();
generateRandomBlock();
updateFPSTimer();

// Start the game loop
requestAnimationFrame(gameLoop);