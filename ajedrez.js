let board = [
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'], // 0
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // 1
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // 2
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // 3
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // 4
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // 5
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], // 6
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']  // 7
    ];
  //  0    1    2    3    4    5    6    7

let white = ['p', 'r', 'n', 'b', 'q', 'k'];
let black = ['P', 'R', 'N', 'B', 'Q', 'K'];

let moveSound = new Audio('./audio/moveSound.mp3');

let blackInCheck = false;
let whiteInCheck = false;

function inCheck(board, color, futurePos) {
    let kingPosition = findKing(color, board);
    let opponentColor = (color === 'white') ? 'black' : 'white';

    if (futurePos !== false) {
        kingPosition = futurePos;
    }

    // Check for opponent's pieces threatening the king
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let piece = board[i][j];

            if (piece !== ' ' && (opponentColor === 'white' ? white.includes(piece) : black.includes(piece))) {
                let validMoves = null;
                if (color === 'white') {
                    validMoves = getValidMoves(piece, [i, j], 'black');
                } else {
                    validMoves = getValidMoves(piece, [i, j], 'white');
                }
                for (let move of validMoves) {
                    if (move[0] === kingPosition[0] && move[1] === kingPosition[1]) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}

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

function makeRandomMoveBlack() {
    let blackPiecesIndexes = [];

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
        if (black.includes(board[i][j])) {
            blackPiecesIndexes.push([i, j]);
        }
        }
    }

    // Select a random black piece
    let randomPiece = blackPiecesIndexes[Math.floor(Math.random() * blackPiecesIndexes.length)];
    let pieceType = board[randomPiece[0]][randomPiece[1]];
    let startRow = randomPiece[0];
    let startCol = randomPiece[1];

    if (blackInCheck) {
        pieceType = 'K';
        let kingLoc = findKing('black');
        randomPiece = kingLoc;
        startRow = kingLoc[0];
        startCol = kingLoc[1];
    }

    let validMoves = getValidMoves(pieceType, randomPiece, 'black');

    let randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    if (randomMove === undefined) {
        makeRandomMoveBlack();
    } else {
        let endRow = randomMove[0];
        let endCol = randomMove[1];

        // Attack white if possible
        validMoves.forEach((move) => {
            let x = move[0];
            let y = move[1];

            if (white.includes(board[x][y])) {
                endRow = x;
                endCol = y;
            }
        })

        // If in check, see if move puts king in check
        if (blackInCheck) {
            validMoves.forEach((move) => {
                let check = inCheck(board, 'black', move);
                //console.log(`Would be in Check: ${check}, Move: ${move}`)
                if (!check) {
                    let x = move[0];
                    let y = move[1];
                    endRow = x;
                    endCol = y;
                } else {
                    console.log('CHECKMATE')
                }
            });
        }

        movePieceBlack(pieceType, startRow, startCol, endRow, endCol)
    }
}

function checkSliding(x, y, opponent, validPositions) {
    // Look Up
     for (let i = x - 1; i >= 0; i--) {
        if (board[i][y] === ' ') {
            validPositions.push([i, y]);
        } else if (opponent.includes(board[i][y])) {
            validPositions.push([i, y]);
            break;
        } else {
            break;
        }
    }
    // Look down
    for (let i = x + 1; i <= 7; i++) {
        if (board[i][y] === ' ') {
            validPositions.push([i, y]);
        } else if (opponent.includes(board[i][y])) {
            validPositions.push([i, y]);
            break;
        } else {
            break;
        }
    }
    // Look left
    for (let i = y - 1; i >= 0; i--) {
        if (board[x][i] === ' ') {
            validPositions.push([x, i]);
        } else if (opponent.includes(board[x][i])) {
            validPositions.push([x, i]);
            break;
        } else {
            break;
        }
    }
    // Look right
    for (let i = y + 1; i <= 7; i++) {
        if (board[x][i] === ' ') {
            validPositions.push([x, i]);
        } else if (opponent.includes(board[x][i])) {
            validPositions.push([x, i]);
            break;
        } else {
            break;
        }
    }
}

function checkDiagonalSliding(x, y, opponent, validPositions) {
    // Look Up-Left
    let i = x - 1;
    let j = y - 1;
    while (i >= 0 && j >= 0) {
        if (board[i][j] === ' ') {
            validPositions.push([i, j]);
        } else if (opponent.includes(board[i][j])) {
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
        if (board[i][j] === ' ') {
            validPositions.push([i, j]);
        } else if (opponent.includes(board[i][j])) {
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
        if (board[i][j] === ' ') {
            validPositions.push([i, j]);
        } else if (opponent.includes(board[i][j])) {
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
        if (board[i][j] === ' ') {
            validPositions.push([i, j]);
        } else if (opponent.includes(board[i][j])) {
            validPositions.push([i, j]);
            break;
        } else {
            break;
        }
        i++;
        j++;
    }
}

function checkKnightMoves(x, y, opponent, validPositions) {
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
            if (board[i][j] === ' ' || opponent.includes(board[i][j])) {
                validPositions.push([i, j]);
            }
        }
    });
}

function checkPawnMoves(x, y, opponent, validPositions) {
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
    let bounds = opponent === black ? x > 1 : x < 6;
    let start = opponent === black ? 6 : 1;

    // Check pawn possible positions
    if (board[forward1[0]][forward1[1]] === ' ') {
        validPositions.push(forward1);
    }
    if (bounds) { // Check if out of bounds
        if (board[forward2[0]][forward2[1]] === ' ' && board[forward1[0]][forward1[1]] === ' ' && x === start) {
            validPositions.push(forward2);
        }
    }
    if (board[diagL[0]][diagL[1]] !== ' ' && opponent.includes(board[diagL[0]][diagL[1]])) {
        validPositions.push(diagL);
    }
    if (board[diagR[0]][diagR[1]] !== ' ' && opponent.includes(board[diagR[0]][diagR[1]])) {
        validPositions.push(diagR);
    }
}

function checkKingMoves(x, y, opponent, validPositions) {
    // Up down left right diagonal
    const kingMoves = [
        [x - 1, y - 1], [x - 1, y], [x - 1, y + 1],
        [x, y - 1], [x, y + 1], [x + 1, y - 1], 
        [x + 1, y], [x + 1, y + 1]
    ];

    kingMoves.forEach(([i, j]) => {
        if (i >= 0 && i <= 7 && j >= 0 && j <= 7) { 
            if (board[i][j] === ' ' || opponent.includes(board[i][j])) {
                validPositions.push([i, j]);
            }
        }
    });
}

function getValidMoves(piece, pos, color) {
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
            checkPawnMoves(x, y, opponent, validPositions);
            break;
        case 'k':
            checkKingMoves(x, y, opponent, validPositions)
            break;
        case 'n': 
            checkKnightMoves(x, y, opponent, validPositions);
            break;
        case 'r':
            checkSliding(x, y, opponent, validPositions);
            break;
        case 'b':
            checkDiagonalSliding(x, y, opponent, validPositions);
            break;
        case 'q':
            checkSliding(x, y, opponent, validPositions);
            checkDiagonalSliding(x, y, opponent, validPositions);
            break;
    }

    return validPositions;
}

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

function movePiece(piece, startRow, startCol, endRow, endCol) {
    let isValid = true;

    if (isValid) {
        board[startRow][startCol] = ' ';
        board[endRow][endCol] = piece;
        drawBoard();
        moveSound.play();
        setTimeout(function() {
            makeRandomMoveBlack();
        }, 2000);
    } else {
        console.error('Jugada Invalida!');
        drawBoard();
    }
}

let eventHandlers = [];

function handleValidPosClick(newPosStr, x, y, piece) {
    let newPos = [Number(newPosStr[0]), Number(newPosStr[2])];
    movePiece(piece, x, y, newPos[0], newPos[1]);
    removeValidMoves();
}

function handleValidPosClickHandler(squareId, x, y, piece) {
    function clickHandler() {
        handleValidPosClick(squareId, x, y, piece);
    }
    eventHandlers.push(clickHandler);
    return clickHandler;
}

function showValidMoves(piece, pos) {
    removeValidMoves();
    let x = pos[0];
    let y = pos[1];
    let opponent = black;

    function highlightValid(validPositions) {
        validPositions.forEach((position) => {
            let square = document.getElementById(`${position[0]}-${position[1]}`);
            square.style.backgroundColor = 'rgb(147, 222, 122)';
            let clickHandler = handleValidPosClickHandler(square.id, x, y, piece);
            square.addEventListener('click', clickHandler);
        });
    }

    let validPositions = [];

    switch (piece) {
        case 'p': 
            checkPawnMoves(x, y, opponent, validPositions)
            highlightValid(validPositions);
            break;
        case 'k':
            checkKingMoves(x, y, opponent, validPositions);
            highlightValid(validPositions);
            break;
        case 'n': 
            checkKnightMoves(x, y, opponent, validPositions);
            highlightValid(validPositions);
            break;
        case 'r':
            checkSliding(x, y, opponent, validPositions);
            highlightValid(validPositions);
            break;
        case 'b':
            checkDiagonalSliding(x, y, opponent, validPositions);
            highlightValid(validPositions);
            break;
        case 'q':
            checkSliding(x, y, opponent, validPositions);
            checkDiagonalSliding(x, y, opponent, validPositions);
            highlightValid(validPositions);
            break;
    }
}

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
    eventHandlers = [];
}

function drawBoard() {
    //whiteInCheck = inCheck(board, 'white', false);
    //blackInCheck = inCheck(board, 'black', false);
    //console.log(`White: ${whiteInCheck}`);
    //console.log(`Black ${blackInCheck}`)
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let piece = board[i][j];
            let pos = [i, j];

            let square = document.getElementById(`${i}-${j}`);
            let img = document.createElement('img');
            img.draggable = false;
            img.className = 'piece';
            square.innerHTML = '';

            switch (piece) {
                case 'P': 
                    img.src = './images/B_Pawn.png'; 
                    square.appendChild(img);
                    break
                case 'p': 
                    img.src = './images/W_Pawn.png'; 
                    square.appendChild(img);
                    img.addEventListener('click', function handlePieceClick() {
                        if (!whiteInCheck) {
                            showValidMoves(piece, pos);
                        }
                        img.removeEventListener('click', handlePieceClick);
                    });
                    break;
                case 'R': 
                    img.src = './images/B_Rook.png'; 
                    square.appendChild(img);
                    break
                case 'r': 
                    img.src = './images/W_Rook.png'; 
                    square.appendChild(img);
                    img.addEventListener('click', function handlePieceClick() {
                        if (!whiteInCheck) {
                            showValidMoves(piece, pos);
                        }
                        img.removeEventListener('click', handlePieceClick);
                    });
                    break;
                case 'N': 
                    img.src = './images/B_Knight.png'; 
                    square.appendChild(img);
                    break
                case 'n': 
                    img.src = './images/W_Knight.png'; 
                    square.appendChild(img);
                    img.addEventListener('click', function handlePieceClick() {
                        if (!whiteInCheck) {
                            showValidMoves(piece, pos);
                        }
                        img.removeEventListener('click', handlePieceClick);
                    });
                    break;
                case 'B': 
                    img.src = './images/B_Bishop.png'; 
                    square.appendChild(img);
                    break
                case 'b': 
                    img.src = './images/W_Bishop.png'; 
                    square.appendChild(img);
                    img.addEventListener('click', function handlePieceClick() {
                        if (!whiteInCheck) {
                            showValidMoves(piece, pos);
                        }
                        img.removeEventListener('click', handlePieceClick);
                    });
                    break;
                case 'Q': 
                    img.src = './images/B_Queen.png'; 
                    square.appendChild(img);
                    break
                case 'q': 
                    img.src = './images/W_Queen.png'; 
                    square.appendChild(img);
                    img.addEventListener('click', function handlePieceClick() {
                        if (!whiteInCheck) {
                            showValidMoves(piece, pos);
                        }
                        img.removeEventListener('click', handlePieceClick);
                    });
                    break;
                case 'K': 
                    img.src = './images/B_King.png'; 
                    square.appendChild(img);
                    break
                case 'k': 
                    img.src = './images/W_King.png'; 
                    square.appendChild(img);
                    img.addEventListener('click', function handlePieceClick() {
                        showValidMoves(piece, pos);
                        img.removeEventListener('click', handlePieceClick);
                    });
                    break;
            }


        }
    }
}

drawBoard();