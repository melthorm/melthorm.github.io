import chess
import random

# Function to read in puzzles from the file
def readPuzzles(filename):
    puzzles = []
    
    with open(filename, 'r') as file:
        lines = file.readlines()
        
        current_game = {}
        game_lines = []
        for line in lines:
            line = line.strip()
            if line:
                if line[0].isdigit() or '/' in line:  # Moves FEN line
                    game_lines.append(line)
                else:
                    if current_game:
                        puzzles.append(current_game)
                        current_game = {}
                    current_game['metadata'] = line
                    game_lines = []
            else:
                if game_lines:
                    current_game['fen'] = game_lines[0]
                    current_game['moves'] = ' '.join(game_lines[1:])
                    game_lines = []

        if current_game:  # other game
            puzzles.append(current_game)
    
    return puzzles

# Function to display the board with revealed squares
def display_board(board, guessed_squares):
    for rank in range(7, -1, -1):  # Oppositize
        for file in range(8):
            square = chess.square(file, rank)
            piece = board.piece_at(square)
            if square in guessed_squares and piece:
                print(piece, end=' ')
            else:
                print('.', end=' ')
        print()  # New line after each row


# Chess hangman game
def play_chess_hangman(board):
    guessed_squares = set()
    occupied_squares = {square for square in chess.SQUARES if board.piece_at(square)}

    print("Welcome to Chess Hangman!")
    display_board(board, guessed_squares)  # Display blank board

    while len(guessed_squares) < len(occupied_squares):
        guess = input("Enter a square (e.g., e4): ").lower()
        square = chess.SQUARE_NAMES.index(guess) if guess in chess.SQUARE_NAMES else None

        if square is None:
            print("Invalid input. Try again.")
            continue

        if square in occupied_squares:
            guessed_squares.add(square)
            print(f"Correct! {len(guessed_squares)} out of {len(occupied_squares)} squares guessed.")
        else:
            print("That square is empty!")

        display_board(board, guessed_squares)  # Display updated board

# Mlo
def run_chess_hangman_game(filename):
    puzzles = readPuzzles(filename)
    random_puzzle = random.choice(puzzles)

    print(f"Random Puzzle: {random_puzzle['metadata']}")
    print(f"Moves: {random_puzzle['moves']}\n")

    # Set up the board with the FEN string
    board = chess.Board(random_puzzle['fen'])
    
    play_chess_hangman(board)

# run time
filename = 'FENpuzzles.txt'
run_chess_hangman_game(filename)

