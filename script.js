// HTML Elements
const board = document.getElementById('board'); // Board element
const scoreBoard = document.getElementById('scoreBoard'); // Score board element
const startButton = document.getElementById('start'); // Start button element
const gameOverSign = document.getElementById('gameOver'); // Game over sign element

// Game settings
const boardSize = 10; // Size of the board
const gameSpeed = 100; // Speed of the game
const squareTypes = { // Types of squares on the board
    emptySquare: 0, // Empty square type
    snakeSquare: 1, // Snake square type
    foodSquare: 2 // Food square type
};
const directions = { // Directions for movement
    ArrowUp: -10, // Move up
    ArrowDown: 10, // Move down
    ArrowRight: 1, // Move right
    ArrowLeft: -1, // Move left
};

// Game variables
let snake; // Snake array
let score; // Score of the player
let direction; // Current direction of movement
let boardSquares; // Representation of the board as a 2D array
let emptySquares; // Array to store empty squares
let moveInterval; // Interval for moving the snake

const drawSnake = () => { // Function to draw the snake on the board
    snake.forEach(square => drawSquare(square, 'snakeSquare')); // Draw each square of the snake
}

// Function to draw a square on the board
// @params 
// square: Position of the square,
// type: Type of square (emptySquare, snakeSquare, foodSquare)
const drawSquare = (square, type) => {
    const [row, column] = square.split(''); // Split square position into row and column
    boardSquares[row][column] = squareTypes[type]; // Set the type of square in the boardSquares array
    const squareElement = document.getElementById(square); // Get the square element from the DOM
    squareElement.setAttribute('class', `square ${type}`); // Set the class attribute of the square element

    // Update emptySquares array based on the type of square
    if (type === 'emptySquare') { // If it's an empty square, add it to the emptySquares array
        emptySquares.push(square);
    } else { // If it's not an empty square, remove it from the emptySquares array
        if (emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }
    }
}

const moveSnake = () => { // Function to move the snake
    const newSquare = String( // Calculate the new position of the snake's head
        Number(snake[snake.length - 1]) + directions[direction]
    ).padStart(2, '0'); // Ensure the new position has two digits

    const [row, column] = newSquare.split(''); // Split the new position into row and column

    // Check if the game has ended
    if (newSquare < 0 || 
        newSquare >= boardSize * boardSize  ||
        (direction === 'ArrowRight' && column == 0) ||
        (direction === 'ArrowLeft' && column == 9) ||
        boardSquares[row][column] === squareTypes.snakeSquare) {
        gameOver(); // End the game
    } else { // If the game has not ended
        snake.push(newSquare); // Add the new square to the snake

        if (boardSquares[row][column] === squareTypes.foodSquare) { // If the new square is a food square
            addFood(); // Add food to the board
        } else { // If the new square is not a food square
            const emptySquare = snake.shift(); // Remove the tail of the snake
            drawSquare(emptySquare, 'emptySquare'); // Draw the empty square
        }

        drawSnake(); // Draw the snake on the board
    }
}

const addFood = () => { // Function to add food to the board
    score++; // Increase the player's score
    updateScore(); // Update the score display
    createRandomFood(); // Create food in a random position on the board
}

const gameOver = () => { // Function to handle game over
    gameOverSign.style.display = 'block'; // Display the game over sign
    clearInterval(moveInterval); // Clear the move interval to stop the snake movement
    startButton.disabled = false; // Enable the start button
}

const setDirection = newDirection => { // Function to set the direction of movement
    direction = newDirection; // Set the direction to the new direction
}

const directionEvent = key => { // Function to handle direction events
    switch (key.code) {
        case 'ArrowUp':
            direction != 'ArrowDown' && setDirection(key.code); // Set direction to up if not currently moving down
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code); // Set direction to down if not currently moving up
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code); // Set direction to left if not currently moving right
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code); // Set direction to right if not currently moving left
            break;
    }
}

const createRandomFood = () => { // Function to create food in a random position on the board
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)]; // Select a random empty square
    drawSquare(randomEmptySquare, 'foodSquare'); // Draw food on the selected empty square
}

const updateScore = () => { // Function to update the score display
    scoreBoard.innerText = score; // Update the score board with the current score
}

const createBoard = () => { // Function to create the game board
    boardSquares.forEach((row, rowIndex) => { // Iterate over each row
        row.forEach((column, columnIndex) => { // Iterate over each column in the row
            const squareValue = `${rowIndex}${columnIndex}`; // Generate square value
            const squareElement = document.createElement('div'); // Create a square element
            squareElement.setAttribute('class', 'square emptySquare'); // Set class attribute
            squareElement.setAttribute('id', squareValue); // Set id attribute
            board.appendChild(squareElement); // Append square element to the board
            emptySquares.push(squareValue); // Add square to empty squares array
        });
    });
}

const setGame = () => { // Function to set up the game
    snake = ['00', '01', '02', '03']; // Initialize the snake
    score = snake.length; // Initialize the score
    direction = 'ArrowRight'; // Set initial direction
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare)); // Initialize the boardSquares array
    console.log(boardSquares); // Log the boardSquares array
    board.innerHTML = ''; // Clear the board
    emptySquares = []; // Initialize empty squares array
    createBoard(); // Create the game board
}

const startGame = () => { // Function to start the game
    setGame(); // Set up the game
    gameOverSign.style.display = 'none'; // Hide the game over sign
    startButton.disabled = true; // Disable the start button
    drawSnake(); // Draw the snake on the board
    updateScore(); // Update the score display
    createRandomFood(); // Create food on the board
    document.addEventListener('keydown', directionEvent); // Add event listener for keydown events
    moveInterval = setInterval(() => moveSnake(), gameSpeed); // Set interval for snake movement
}

startButton.addEventListener('click', startGame); // Add event listener for start button click
