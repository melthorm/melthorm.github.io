let puzzles = [];
let occupiedSquares = new Set();
let guessedSquares = new Set();
let currentPuzzle;
let correct = 0;
let guesses = 0;
let maxGuesses;

// Read puzzles from file
async function readPuzzles(filename) {
    const response = await fetch(filename);
    const text = await response.text();
    const lines = text.trim().split('\n');

    let currentGame = {};
    let gameLines = [];
    for (let line of lines) {
        line = line.trim();
        if (line) {
            if (/\d/.test(line[0]) || line.includes('/')) {  // Moves or FEN line
                gameLines.push(line);
            } else {
                if (Object.keys(currentGame).length > 0) {
                    puzzles.push(currentGame);
                    currentGame = {};
                }
                currentGame.metadata = line;
                gameLines = [];
            }
        } else {
            if (gameLines.length > 0) {
                currentGame.fen = gameLines[0];
                currentGame.moves = gameLines.slice(1).join(' ');
                gameLines = [];
            }
        }
    }

    if (Object.keys(currentGame).length > 0) {  // Don't forget the last game
        puzzles.push(currentGame);
    }
}

// Create board from FEN string
function createBoard(fen) {
    let rows = fen.split(' ')[0].split('/');
    let boardArray = [];

    rows.forEach((row, rankIndex) => {
        let currentRow = [];
        row.split('').forEach((char) => {
            if (isNaN(char)) {
                currentRow.push(char);  // Place a piece
                occupiedSquares.add(`${rankIndex},${currentRow.length - 1}`);
            } else {
                let emptySpaces = parseInt(char);
                for (let i = 0; i < emptySpaces; i++) {
                    currentRow.push(null);  // Empty spaces
                }
            }
        });
        boardArray.push(currentRow);
    });

    maxGuesses = Math.floor(occupiedSquares.size * 0.5);
    return boardArray;
}



// Render the chessboard
function renderBoard(board) {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';  // Clear the board

    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            let square = document.createElement('div');
            square.classList.add('square');

            // Alternate between white and black squares
            if ((rank + file) % 2 === 0) {
                square.classList.add('white');
            } else {
                square.classList.add('black');
            }

            // Add click event to guess this square
            square.addEventListener('click', () => guessSquare(rank, file, square, board));

            // square exist go bo
            if (guessedSquares.has(`${rank},${file}`) && board[rank][file] !== null) {		
                square.classList.add(board[rank][file]);
            }
            chessboard.appendChild(square);
        }
    }
}

function fileToLetter(number) {
    return String.fromCharCode(number + 97); 
}

// Handle guessing a square
function guessSquare(rank, file, squareElement, board) {
    let squareKey = `${rank},${file}`;
    console.log(occupiedSquares.has(squareKey));
    if (guessedSquares.has(squareKey)) {
        document.getElementById('message').textContent = `${fileToLetter(file)}${8-rank} has already been guessed. Train your memory/eyes/hands.`;
        guesses = guesses+1;
        highlightRed(squareElement, 5000);
        document.getElementById('guesses').innerHTML = 
        `<strong>${occupiedSquares.size-correct} spaces to fill </strong><br>${guesses} guesses out of ${maxGuesses} used.`;
    } else if (occupiedSquares.has(squareKey)) {
        guessedSquares.add(squareKey);
	    squareElement.classList.add(board[rank][file]);
        document.getElementById('message').textContent = `Correct, ${fileToLetter(file)}${8-rank} has a piece!`;
        highlightGreen(squareElement, 500);
        correct = correct + 1;
        document.getElementById('guesses').innerHTML = 
        `<strong>${occupiedSquares.size-correct} spaces to fill </strong><br>${guesses} guesses out of ${maxGuesses} used.`;
    } else {
        guessedSquares.add(squareKey);
        document.getElementById('message').textContent = `Wrong, ${fileToLetter(file)}${8-rank} does not have a piece.`;
        guesses = guesses+1;
        highlightRed(squareElement, 500);
        document.getElementById('guesses').innerHTML = 
        `<strong>${occupiedSquares.size-correct} spaces to fill </strong><br>${guesses} guesses out of ${maxGuesses} used.`;
    }
    //Check if guesses too many
    if (guesses+1 > maxGuesses) {
        document.getElementById('message').textContent = "All guesses used. You lose. Pieces revealed.";
        preventClicks();
        showAll(board);
    }
    // Check if all squares have been guessed
    if (correct === occupiedSquares.size) {
        document.getElementById('message').textContent = "Every square guessed! Cool puzzle!";
        preventClicks();
    }
}

function highlightGreen(squareElement, time) {
    squareElement.classList.add('highlightedG');

    setTimeout(() => {
        squareElement.classList.remove('highlightedG');
    }, time);
}

function highlightRed(squareElement, time) {
    squareElement.classList.add('highlightedR');

    setTimeout(() => {
        squareElement.classList.remove('highlightedR');
    }, time);
}

function showAll(board) {
    const chessboard = document.getElementById('chessboard');

    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            let squareElement = chessboard.children[rank * 8 + file];
            let squareKey = `${rank},${file}`;

            // If the square is occupied but hasn't been guessed, reveal the piece
            if (occupiedSquares.has(squareKey) && !guessedSquares.has(squareKey)) {
	            squareElement.classList.add(board[rank][file]);
                highlightRed(squareElement, 1000);
            } else if (!occupiedSquares.has(squareKey) && guessedSquares.has(squareKey)) {
                highlightRed(squareElement, 1000);
            } else if (occupiedSquares.has(squareKey)) {
                	squareElement.classList.add(board[rank][file]);
                highlightGreen(squareElement, 1000);
            }
        }
    }
}


function preventClicks() {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.style.pointerEvents = 'none'; // Disable further clicks on all squares
    });
}


// loopb oi
async function runChessHangmanGame(filename) {
    await readPuzzles(filename);
    currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

    console.log(`Random Puzzle: ${currentPuzzle.metadata}`);
    console.log(`FEN: ${currentPuzzle.fen}`);
    console.log(`Moves: ${currentPuzzle.moves}\n`);

    let board = createBoard(currentPuzzle.fen);

    // Display the player names and FEN
    document.getElementById('puzzleInfo').innerHTML = 
        `<strong>${currentPuzzle.metadata}</strong><br>FEN: ${currentPuzzle.moves}`;
    document.getElementById('guesses').innerHTML = 
        `<strong>${occupiedSquares.size-correct} squares to fill </strong><br>${guesses} guesses out of ${maxGuesses} used.`;
    document.getElementById('redoButton').addEventListener('click', reloadGame);

    renderBoard(board);
}

function reloadGame() {
    location.reload(); // Reload 
}

// runnininii
const filename = 'FENpuzzles.txt';
runChessHangmanGame(filename);

