let board = [
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
];

let white = ['p', 'r', 'n', 'b', 'q', 'k'];
let black = ['P', 'R', 'N', 'B', 'Q', 'K'];

let checkmate = false;
let winner = null;
let moveSound = new Audio('./audio/moveSound.mp3');

let blackInCheck = false;
let whiteInCheck = false;

let canMove = true;

// Function to check for check
function inCheck(boardToCheck, color, kingPos) {
    let opponentColor = (color === 'white') ? 'black' : 'white';

    // Check for opponent's pieces threatening the king
    for (let i = 0; i < boardToCheck.length; i++) {
        for (let j = 0; j < boardToCheck[i].length; j++) {
            let piece = boardToCheck[i][j];
            let piecePos = [i, j];

            if (piece !== ' ' && (opponentColor === 'white' ? white.includes(piece) : black.includes(piece))) {
                let validMoves = null;
                if (color === 'white') {
                    validMoves = getValidMoves(piece, piecePos, 'black', boardToCheck);
                } else {
                    validMoves = getValidMoves(piece, piecePos, 'white', boardToCheck);
                }
                for (let move of validMoves) {
                    if (move[0] === kingPos[0] && move[1] === kingPos[1]) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}

// Check 4 directional sliding moves for validity
function checkSliding(x, y, opponent, validPositions, boardToCheck) {
    // Look Up
     for (let i = x - 1; i >= 0; i--) {
        if (boardToCheck[i][y] === ' ') {
            validPositions.push([i, y]);
        } else if (opponent.includes(boardToCheck[i][y])) {
            validPositions.push([i, y]);
            break;
        } else {
            break;
        }
    }
    // Look down
    for (let i = x + 1; i <= 7; i++) {
        if (boardToCheck[i][y] === ' ') {
            validPositions.push([i, y]);
        } else if (opponent.includes(boardToCheck[i][y])) {
            validPositions.push([i, y]);
            break;
        } else {
            break;
        }
    }
    // Look left
    for (let i = y - 1; i >= 0; i--) {
        if (boardToCheck[x][i] === ' ') {
            validPositions.push([x, i]);
        } else if (opponent.includes(boardToCheck[x][i])) {
            validPositions.push([x, i]);
            break;
        } else {
            break;
        }
    }
    // Look right
    for (let i = y + 1; i <= 7; i++) {
        if (boardToCheck[x][i] === ' ') {
            validPositions.push([x, i]);
        } else if (opponent.includes(boardToCheck[x][i])) {
            validPositions.push([x, i]);
            break;
        } else {
            break;
        }
    }
}

// Check 4 diagonal sliding moves for validity
function checkDiagonalSliding(x, y, opponent, validPositions, boardToCheck) {
    // Look Up-Left
    let i = x - 1;
    let j = y - 1;
    while (i >= 0 && j >= 0) {
        if (boardToCheck[i][j] === ' ') {
            validPositions.push([i, j]);
        } else if (opponent.includes(boardToCheck[i][j])) {
            validPositions.push([i, j]);
            break;
        } else {
            break;
        }
        i--;
        j--;
    }
    // Look Up-Right
    i = x - 1;
    j = y + 1;
    while (i >= 0 && j <= 7) {
        if (boardToCheck[i][j] === ' ') {
            validPositions.push([i, j]);
        } else if (opponent.includes(boardToCheck[i][j])) {
            validPositions.push([i, j]);
            break;
        } else {
            break;
        }
        i--;
        j++;
    }
    // Look Down-Left
    i = x + 1;
    j = y - 1;
    while (i <= 7 && j >= 0) {
        if (boardToCheck[i][j] === ' ') {
            validPositions.push([i, j]);
        } else if (opponent.includes(boardToCheck[i][j])) {
            validPositions.push([i, j]);
            break;
        } else {
            break;
        }
        i++;
        j--;
    }
    // Look Down-Right
    i = x + 1;
    j = y + 1;
    while (i <= 7 && j <= 7) {
        if (boardToCheck[i][j] === ' ') {
            validPositions.push([i, j]);
        } else if (opponent.includes(boardToCheck[i][j])) {
            validPositions.push([i, j]);
            break;
        } else {
            break;
        }
        i++;
        j++;
    }
}

// Check l-shaped moves for validity
function checkKnightMoves(x, y, opponent, validPositions, boardToCheck, color) {
    // L shaped movesets
    const knightMoves = [
        [x - 2, y - 1],
        [x - 2, y + 1],
        [x - 1, y - 2],
        [x - 1, y + 2],
        [x + 1, y - 2],
        [x + 1, y + 2],
        [x + 2, y - 1],
        [x + 2, y + 1]
    ];

    knightMoves.forEach(([i, j]) => {
        if (i >= 0 && i <= 7 && j >= 0 && j <= 7) { 
            if (boardToCheck[i][j] === ' ' || opponent.includes(boardToCheck[i][j])) {
                validPositions.push([i, j]);
            }
        }
    });
}

// Check pawn validity
function checkPawnMoves(x, y, opponent, validPositions, boardToCheck) {
    let up1 = [x - 1, y];
    let up2 = [x - 2, y];
    let down1 = [x + 1, y];
    let down2 = [x + 2, y];
    let diagLUp = [x - 1, y - 1];
    let diagRUp = [x - 1, y + 1];
    let diagLDown = [x + 1, y + 1];
    let diagRDown = [x + 1, y - 1];

    let forward1 = opponent === black ? up1 : down1;
    let forward2 = opponent === black ? up2 : down2;
    let diagL = opponent === black ? diagLUp : diagLDown;
    let diagR = opponent === black ? diagRUp : diagRDown;
    let bounds = opponent === black ? x > 0 : x < 7;
    let start = opponent === black ? 6 : 1;
    
    // Check pawn possible positions
    if (x === start) {
        if (boardToCheck[forward2[0]][forward2[1]] === ' ' && boardToCheck[forward1[0]][forward1[1]] === ' ') {
            validPositions.push(forward2);
        }
    }

    if (bounds) {
        if (board[forward1[0]][forward1[1]] === ' ') {
            validPositions.push(forward1);
        }
        if (boardToCheck[diagL[0]][diagL[1]] !== ' ' && opponent.includes(boardToCheck[diagL[0]][diagL[1]])) {
            validPositions.push(diagL);
        }
        if (boardToCheck[diagR[0]][diagR[1]] !== ' ' && opponent.includes(boardToCheck[diagR[0]][diagR[1]])) {
            validPositions.push(diagR);
        }
    }
}


// Check king moves for validity
function checkKingMoves(x, y, opponent, validPositions, boardToCheck, color) {
    // Up down left right diagonal
    const kingMoves = [
        [x - 1, y - 1], [x - 1, y], [x - 1, y + 1],
        [x, y - 1], [x, y + 1], [x + 1, y - 1], 
        [x + 1, y], [x + 1, y + 1]
    ];

    kingMoves.forEach(([i, j]) => {
        if (i >= 0 && i <= 7 && j >= 0 && j <= 7) { 
            if (boardToCheck[i][j] === ' ' || opponent.includes(boardToCheck[i][j])) {
                validPositions.push([i, j]);
            }
        }
    });
}

// Get a list of all valid moves for a given piece and color
function getValidMoves(piece, pos, color, boardToCheck) {
    let x = pos[0];
    let y = pos[1];

    let opponent = null;

    if (color === 'white') {
        opponent = black;
    } else {
        opponent = white;
    }

    piece = piece.toLowerCase();
    let validPositions = [];

    switch (piece) {
        case 'p': 
            checkPawnMoves(x, y, opponent, validPositions, boardToCheck);
            break;
        case 'k':
            checkKingMoves(x, y, opponent, validPositions, boardToCheck, color)
            break;
        case 'n': 
            checkKnightMoves(x, y, opponent, validPositions, boardToCheck, color);
            break;
        case 'r':
            checkSliding(x, y, opponent, validPositions, boardToCheck);
            break;
        case 'b':
            checkDiagonalSliding(x, y, opponent, validPositions, boardToCheck);
            break;
        case 'q':
            checkSliding(x, y, opponent, validPositions, boardToCheck);
            checkDiagonalSliding(x, y, opponent, validPositions, boardToCheck);
            break;
    }

    return validPositions;
}

// Move the piece and draw the board again, add delay
function movePiece(piece, startRow, startCol, endRow, endCol) {
    board[startRow][startCol] = ' ';
    board[endRow][endCol] = piece;
    drawBoard();
    moveSound.play();
    canMove = false;
    setTimeout(function() {
        makeRandomMoveBlack();
        canMove = true;
    }, 2000);
}

// Move blacks piece and redraw board
function movePieceBlack(piece, startRow, startCol, endRow, endCol) {
    let isValid = true;

    if (isValid) {
        board[startRow][startCol] = ' ';
        board[endRow][endCol] = piece;
        moveSound.play();
        drawBoard();
    } else {
        drawBoard();
        makeRandomMoveBlack();
    }
}

// Event handlers to later remove
let eventHandlers = [];

// Add on click, to move to that square and then clear
function handleValidPosClick(newPosStr, x, y, piece) {
    if (canMove) {
        let newPos = [Number(newPosStr[0]), Number(newPosStr[2])];
        movePiece(piece, x, y, newPos[0], newPos[1]);
        removeValidMoves();
    }
}

// We need this to be able to remove click events later
function handleValidPosClickHandler(squareId, x, y, piece) {
    function clickHandler() {
        handleValidPosClick(squareId, x, y, piece);
    }
    eventHandlers.push(clickHandler);
    return clickHandler;
}

// Check all valid moves, if valid, highlight all valid move squares
function showValidMoves(piece, pos) {
    removeValidMoves();
    let x = pos[0];
    let y = pos[1];
    let opponent = black;

    // Check if King would be in check, if not highlight moves
    function highlightValid(validPositions, pieceType) {
        if (canMove) {
            validPositions.forEach((newPos) => {
                let kingPos = findKing('white');
    
                if (pieceType === 'k') {
                    kingPos = [newPos[0], newPos[1]];
                }
    
                let tempBoard = JSON.parse(JSON.stringify(board));
                tempBoard[newPos[0]][newPos[1]] = pieceType;
                tempBoard[x][y] = ' ';
    
                let wouldBeInCheck = inCheck(tempBoard, 'white', kingPos);
    
                if (!wouldBeInCheck) {
                    let square = document.getElementById(`${newPos[0]}-${newPos[1]}`);
                    square.style.backgroundColor = 'rgb(147, 222, 122)';
                    let clickHandler = handleValidPosClickHandler(square.id, x, y, piece);
                    square.addEventListener('click', clickHandler);
                }
            });
        }
    }

    let validPositions = [];
    let boardToCheck = board;

    switch (piece) {
        case 'p': 
            checkPawnMoves(x, y, opponent, validPositions, boardToCheck)
            highlightValid(validPositions, 'p');
            break;
        case 'k':
            checkKingMoves(x, y, opponent, validPositions, boardToCheck, 'white');
            highlightValid(validPositions, 'k');
            break;
        case 'n': 
            checkKnightMoves(x, y, opponent, validPositions, boardToCheck);
            highlightValid(validPositions, 'n');
            break;
        case 'r':
            checkSliding(x, y, opponent, validPositions, boardToCheck);
            highlightValid(validPositions, 'r');
            break;
        case 'b':
            checkDiagonalSliding(x, y, opponent, validPositions, boardToCheck);
            highlightValid(validPositions, 'b');
            break;
        case 'q':
            checkSliding(x, y, opponent, validPositions, boardToCheck);
            checkDiagonalSliding(x, y, opponent, validPositions, boardToCheck);
            highlightValid(validPositions, 'q');
            break;
    }
}


// Remove move highlights and invalidate those squares as valid moves
function removeValidMoves() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let square = document.getElementById(`${i}-${j}`);

            if (square.className === 'square squareWhite' && square.style.backgroundColor === 'rgb(147, 222, 122)') {
                square.style.backgroundColor = 'rgb(233, 221, 200)';
                eventHandlers.forEach(handler => {
                    square.removeEventListener('click', handler);
                });
            } else if (square.className === 'square squareBlack' && square.style.backgroundColor === 'rgb(147, 222, 122)') {
                square.style.backgroundColor = 'rgb(93, 141, 93)';
                eventHandlers.forEach(handler => {
                    square.removeEventListener('click', handler);
                });
            }
        }
    }
    drawBoard();
    eventHandlers = [];
}

// Find the position of the given colors king
function findKing(color) {
    let king = (color === 'white') ? 'k' : 'K';

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === king) {
                return [i, j];
            }
        }
    }
}

// Find the positions of attacking threats to the king
function findAttackers(color, kingPos) {
    let attackers = [];
    let [kingRow, kingCol] = kingPos;

    // Check all opponent's pieces for possible attacks
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let piece = board[i][j];
            let piecePos = [i, j];

            if (color === 'white' && black.includes(board[i][j])) {
                let validMoves = getValidMoves(piece, piecePos, 'black', board);
                for (let move of validMoves) {
                    let [endRow, endCol] = move;
                    if (endRow === kingRow && endCol === kingCol) {
                        attackers.push([i, j]);
                    }
                }
            } else if (color === 'black' && white.includes(board[i][j])) {
                let validMoves = getValidMoves(piece, piecePos, 'white', board);
                for (let move of validMoves) {
                    let [endRow, endCol] = move;
                    if (endRow === kingRow && endCol === kingCol) {
                        attackers.push([i, j]);
                    }
                }
            }
        }
    }

    return attackers;
}

// Find a straight line path between 2 pieces
function getPathBetweenPositions(startPos, endPos) {
    let [startRow, startCol] = startPos;
    let [endRow, endCol] = endPos;
    let path = [];

    // Determine direction of movement
    let rowDirection = Math.sign(endRow - startRow);
    let colDirection = Math.sign(endCol - startCol);

    // Add positions between start and end positions
    let row = startRow + rowDirection;
    let col = startCol + colDirection;
    while (row !== endRow || col !== endCol) {
        path.push([row, col]);
        row += rowDirection;
        col += colDirection;
    }

    return path;
}

// Have Black choose a random move, or respond to being in check
function makeRandomMoveBlack() {
    let blackPiecesIndexes = [];

    // Find all black pieces and their indexes
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (black.includes(board[i][j])) {
                blackPiecesIndexes.push([i, j]);
            }
        }
    }

    // If black is in check, attempt to get out
    if (blackInCheck) {
        let kingPos = findKing('black'); 
        let [kingRow, kingCol] = kingPos;

        let canTakeAction = true;

        // Try capturing the attacking piece
        let attackers = findAttackers('black', kingPos);
        let attacker = attackers[0];
        let attackerRow = attacker[0];
        let attackerCol = attacker[1];

        if (canTakeAction) {
            // Try capturing the attacking piece
            for (let i = 0; i < blackPiecesIndexes.length; i++) {
                let [startRow, startCol] = blackPiecesIndexes[i];
                let piece = board[startRow][startCol];
                let piecePos = [startRow, startCol];
                let validMoves = getValidMoves(piece, piecePos, 'black', board);
            
                for (let move of validMoves) {
                    let [endRow, endCol] = move;
                    if (white.includes(board[endRow][endCol])) {
                        if (endRow == attackerRow && endCol == attackerCol && canTakeAction) {
                            let tempBoard = JSON.parse(JSON.stringify(board));
                            tempBoard[endRow][endCol] = board[startRow][startCol];
                            tempBoard[startRow][startCol] = ' ';

                            if (piece === 'K') {
                                kingPos = [endRow, endCol];
                            }

                            if (!inCheck(tempBoard, 'black', kingPos) && canTakeAction) {
                                canTakeAction = false;
                                // console.log('RAN ATTACK')
                                movePieceBlack(piece, startRow, startCol, endRow, endCol);
                                return;
                            }
                        }
                    }
                }
            }
        }

        if (canTakeAction) {
            let kingPos = findKing('black');
            // Try blocking the check
             if (board[attacker[0]][attacker[1]] !== 'n') { // No way to block knights
                let blockableSquares = getPathBetweenPositions(attacker, kingPos);

                for (let i = 0; i < blackPiecesIndexes.length; i++) {
                    let [startRow, startCol] = blackPiecesIndexes[i];
                    let piece = board[startRow][startCol];
                    let piecePos = [startRow, startCol];
                    let validMoves = getValidMoves(piece, piecePos, 'black', board);
                
                    for (let move of validMoves) {
                        let [endRow, endCol] = move;
                        let tempBoard = JSON.parse(JSON.stringify(board));
                        tempBoard[endRow][endCol] = board[startRow][startCol];
                        tempBoard[startRow][startCol] = ' ';

                        if (piece === 'K') {
                            kingPos = [endRow, endCol];
                        }

                        blockableSquares.forEach((square) => {
                            if (endRow == square[0] && endCol == square[1] && piece !== 'K' && canTakeAction) {
                                if (!inCheck(tempBoard, 'black', kingPos) && canTakeAction) {
                                    canTakeAction = false;
                                    // console.log('RAN BLOCK')
                                    movePieceBlack(piece, startRow, startCol, endRow, endCol);
                                    return;
                                }
                            } 
                        })
                    }
                }
            }
        }

        if (canTakeAction) {
            let kingPos = findKing('black');
            // Try moving the king out of check
            let validKingMoves = getValidMoves('K', kingPos, 'black', board);
            for (let move of validKingMoves) {
                let [endRow, endCol] = move;
                let tempBoard = JSON.parse(JSON.stringify(board));
                tempBoard[endRow][endCol] = board[kingRow][kingCol];
                tempBoard[kingRow][kingCol] = ' ';

                if (!inCheck(tempBoard, 'black', [endRow, endCol]) && canTakeAction) {
                    canTakeAction = false;
                    // console.log('RAN RETREAT')
                    movePieceBlack(board[kingRow][kingCol], kingRow, kingCol, endRow, endCol);
                    return;
                }
            }
        }

        // Black in checkmate
        if (canTakeAction) {
            checkmate = true;
            winner = 'White';
            drawBoard();
        }

    } else {
        let kingPos = findKing('black');

        // Look for an attacking move
        for (let i = 0; i < blackPiecesIndexes.length; i++) {
            let [startRow, startCol] = blackPiecesIndexes[i];
            let piece = board[startRow][startCol];
            let piecePos = [startRow, startCol];
            let validMoves = getValidMoves(piece, piecePos, 'black', board);

            for (let move of validMoves) {
                let [endRow, endCol] = move;
                let tempBoard = JSON.parse(JSON.stringify(board));
                tempBoard[endRow][endCol] = board[startRow][startCol];
                tempBoard[startRow][startCol] = ' ';

                if (piece === 'K') {
                    kingPos = [endRow, endCol];
                }

                if (white.includes(board[endRow][endCol])) {
                    if (!inCheck(tempBoard, 'black', kingPos)) {
                        // console.log('RAN RANDOM ATTACK')
                        movePieceBlack(piece, startRow, startCol, endRow, endCol);
                        return;
                    }
                }
            }
        }

        // If no attacking move found, make a random move
        function makeRandomMove() {
            let randomIndex = Math.floor(Math.random() * blackPiecesIndexes.length);
            let [startRow, startCol] = blackPiecesIndexes[randomIndex];
            let piece = board[startRow][startCol];
            let piecePos = [startRow, startCol];
            let validMoves = getValidMoves(piece, piecePos, 'black', board);
            let randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];

            // console.log('RAN RANDOM')
        
            if (randomMove === undefined) {
                makeRandomMove();
            } else {
                let endRow = randomMove[0];
                let endCol = randomMove[1];

                let tempBoard = JSON.parse(JSON.stringify(board));
                tempBoard[endRow][endCol] = board[startRow][startCol];
                tempBoard[startRow][startCol] = ' ';

                if (piece === 'K') {
                    kingPos = [endRow, endCol];
                }

                if (!inCheck(tempBoard, 'black', kingPos)) {
                    movePieceBlack(piece, startRow, startCol, endRow, endCol);
                    return;
                } else {
                    // Look for the first valid move
                    for (let i = 0; i < blackPiecesIndexes.length; i++) {
                        let [startRow, startCol] = blackPiecesIndexes[i];
                        let piece = board[startRow][startCol];
                        let piecePos = [startRow, startCol];
                        let validMoves = getValidMoves(piece, piecePos, 'black', board);

                        for (let move of validMoves) {
                            let [endRow, endCol] = move;
                            let tempBoard = JSON.parse(JSON.stringify(board));
                            tempBoard[endRow][endCol] = board[startRow][startCol];
                            tempBoard[startRow][startCol] = ' ';

                            if (piece === 'K') {
                                kingPos = [endRow, endCol];
                            }

                            if (!inCheck(tempBoard, 'black', kingPos)) {
                                // console.log('RAN RANDOM ATTACK')
                                movePieceBlack(piece, startRow, startCol, endRow, endCol);
                                return;
                            }
                        }
                    }
                }
            }
        }

        makeRandomMove();
    }
}

// Promote pawn to queen if found on the other side
function promotePawns() {
    let topRow = board[0];
    let bottomRow = board[7];

    for (let i = 0; i < topRow.length; i++) {
        let piece = board[0][i];

        if (piece == 'p') {
            board[0][i] = 'q';
        }
    }

    for (let i = 0; i < bottomRow.length; i++) {
        let piece = board[7][i];

        if (piece == 'P') {
            board[7][i] = 'Q';
        }
    }
}

// Validate if white in checkmate
function whiteInCheckmate() {
    let whitePiecesIndexes = [];

    // Find all white pieces and their indexes
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (white.includes(board[i][j])) {
                whitePiecesIndexes.push([i, j]);
            }
        }
    }

    // If white is in check, attempt to get out
    if (whiteInCheck) {
        let kingPos = findKing('white'); 
        let [kingRow, kingCol] = kingPos;

        let canTakeAction = true;

        // Try capturing the attacking piece
        let attackers = findAttackers('white', kingPos);
        let attacker = attackers[0];
        let attackerRow = attacker[0];
        let attackerCol = attacker[1];

        if (canTakeAction) {
            // Try capturing the attacking piece
            for (let i = 0; i < whitePiecesIndexes.length; i++) {
                let [startRow, startCol] = whitePiecesIndexes[i];
                let piece = board[startRow][startCol];
                let piecePos = [startRow, startCol];
                let validMoves = getValidMoves(piece, piecePos, 'white', board);
            
                for (let move of validMoves) {
                    let [endRow, endCol] = move;
                    if (black.includes(board[endRow][endCol])) {
                        if (endRow == attackerRow && endCol == attackerCol && canTakeAction) {
                            let tempBoard = JSON.parse(JSON.stringify(board));
                            tempBoard[endRow][endCol] = board[startRow][startCol];
                            tempBoard[startRow][startCol] = ' ';

                            if (!inCheck(tempBoard, 'white', kingPos) && canTakeAction) {
                                console.log('1')
                                canTakeAction = false;
                                return;
                            }
                        }
                    }
                }
            }
        }

        if (canTakeAction) {
            // Try blocking the check
             if (board[attacker[0]][attacker[1]] !== 'n') { // No way to block knights
                let blockableSquares = getPathBetweenPositions(attacker, kingPos);

                for (let i = 0; i < whitePiecesIndexes.length; i++) {
                    let [startRow, startCol] = whitePiecesIndexes[i];
                    let piece = board[startRow][startCol];
                    let piecePos = [startRow, startCol];
                    let validMoves = getValidMoves(piece, piecePos, 'white', board);
                
                    for (let move of validMoves) {
                        let [endRow, endCol] = move;
                        let tempBoard = JSON.parse(JSON.stringify(board));
                        tempBoard[endRow][endCol] = board[startRow][startCol];
                        tempBoard[startRow][startCol] = ' ';

                        blockableSquares.forEach((square) => {
                            if (endRow == square[0] && endCol == square[1] && piece !== 'k' && canTakeAction) {
                                if (!inCheck(tempBoard, 'white', kingPos) && canTakeAction) {
                                    console.log('2')
                                    canTakeAction = false;
                                    return;
                                }
                            } 
                        })
                    }
                }
            }
        }

        if (canTakeAction) {
            // Try moving the king out of check
            let validKingMoves = getValidMoves(board[kingRow][kingCol], kingPos, 'white', board);
            for (let move of validKingMoves) {
                let [endRow, endCol] = move;
                let tempBoard = JSON.parse(JSON.stringify(board));
                tempBoard[endRow][endCol] = board[kingRow][kingCol];
                tempBoard[kingRow][kingCol] = ' ';

                let wouldBeInCheck = inCheck(tempBoard, 'white', kingPos);

                if (!wouldBeInCheck && canTakeAction) {
                    canTakeAction = false;
                    return;
                }
            }
        }

        // Black in checkmate
        if (canTakeAction) {
            checkmate = true;
            winner = 'Black';
            drawBoard();
        }

    }
}

// Function to draw the board
function drawBoard() {
    let whiteKingPos = findKing('white');
    let blackKingPos = findKing('black');
    whiteInCheck = inCheck(board, 'white', whiteKingPos);
    blackInCheck = inCheck(board, 'black', blackKingPos);
    whiteInCheckmate();
    promotePawns();
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let piece = board[i][j];
            let pos = [i, j];

            let square = document.getElementById(`${i}-${j}`);
            let img = document.createElement('img');
            img.draggable = false;
            img.className = 'piece';
            square.innerHTML = '';

            let status = document.getElementById('status');

            if (whiteInCheck) {
                status.innerHTML = 'Jaque: Jugador blanco!';
            }

            if (blackInCheck) {
                status.innerHTML = 'Jaque: Jugador negro!';
            }

            if (!whiteInCheck && !blackInCheck) {
                status.innerHTML = 'Jaque: ';
            }

            if (checkmate) {
                let winText = `Jugador negro gana! Perdiste!`;

                if (winner === 'White') {
                    winText = 'Ganaste!';
                }

                status.innerHTML = `Jaque Mate! ${winText}`;
            }

            switch (piece) {
                case 'P': 
                    img.src = './images/B_Pawn.png'; 
                    square.appendChild(img);
                    break
                case 'p': 
                    img.src = './images/W_Pawn.png'; 
                    square.appendChild(img);
                    if (!checkmate) {
                        img.addEventListener('click', function handlePieceClick() {
                            showValidMoves(piece, pos);
                            img.removeEventListener('click', handlePieceClick);
                        });
                    }
                    break;
                case 'R': 
                    img.src = './images/B_Rook.png'; 
                    square.appendChild(img);
                    break
                case 'r': 
                    img.src = './images/W_Rook.png'; 
                    square.appendChild(img);
                    if (!checkmate) {
                        img.addEventListener('click', function handlePieceClick() {
                            showValidMoves(piece, pos);
                            img.removeEventListener('click', handlePieceClick);
                        });
                    }
                    break;
                case 'N': 
                    img.src = './images/B_Knight.png'; 
                    square.appendChild(img);
                    break
                case 'n': 
                    img.src = './images/W_Knight.png'; 
                    square.appendChild(img);
                    if (!checkmate) {
                        img.addEventListener('click', function handlePieceClick() {
                            showValidMoves(piece, pos);
                            img.removeEventListener('click', handlePieceClick);
                        });
                    }
                    break;
                case 'B': 
                    img.src = './images/B_Bishop.png'; 
                    square.appendChild(img);
                    break
                case 'b': 
                    img.src = './images/W_Bishop.png'; 
                    square.appendChild(img);
                    if (!checkmate) {
                        img.addEventListener('click', function handlePieceClick() {
                            showValidMoves(piece, pos);
                            img.removeEventListener('click', handlePieceClick);
                        });
                    }
                    break;
                case 'Q': 
                    img.src = './images/B_Queen.png'; 
                    square.appendChild(img);
                    break
                case 'q': 
                    img.src = './images/W_Queen.png'; 
                    square.appendChild(img);
                    if (!checkmate) {
                        img.addEventListener('click', function handlePieceClick() {
                            showValidMoves(piece, pos);
                            img.removeEventListener('click', handlePieceClick);
                        });
                    }
                    break;
                case 'K': 
                    img.src = './images/B_King.png'; 
                    square.appendChild(img);
                    break
                case 'k': 
                    img.src = './images/W_King.png'; 
                    square.appendChild(img);
                    if (!checkmate) {
                        img.addEventListener('click', function handlePieceClick() {
                            showValidMoves(piece, pos);
                            img.removeEventListener('click', handlePieceClick);
                        });
                    }
                    break;
            }
        }
    }
}

drawBoard();