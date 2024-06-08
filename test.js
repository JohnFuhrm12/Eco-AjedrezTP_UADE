function makeRandomMoveBlack() {
    let blackPiecesIndexes = [];

    let piece = null;
    let startRow = null;
    let startCol = null;
    let endRow = null;
    let endCol = null;

    if (blackInCheck) {

        // Loop through all pieces
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (black.includes(board[i][j])) {
                    piece = board[i][j];
                    startRow = i;
                    startCol = j;

                    let validMoves = getValidMoves(piece, [i, j], 'black');

                    // For each valid move, simulate to see if still in check
                    validMoves.forEach((move) => {
                        endRow = move[0];
                        endCol = move[1];

                        let tempBoard = JSON.parse(JSON.stringify(board));
                        tempBoard[endRow][endCol] = tempBoard[startRow][startCol];
                        tempBoard[startRow][startCol] = ' ';

                        if (!inCheck(tempBoard, 'black', [endRow, endCol])) {
                            // Move is valid
                            movePieceBlack(piece, startRow, startCol, endRow, endCol);
                        } else {
                            endRow = null;
                            endCol = null;
                        }

                    })


                }
            }
        }


    } else {
        // Loop through all pieces and see if an attack is possible
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (black.includes(board[i][j])) {
                    blackPiecesIndexes.push([i, j]);
                    piece = board[i][j];
                    startRow = i;
                    startCol = j;

                    let validMoves = getValidMoves(piece, [i, j], 'black');

                    // Attack white if possible
                    validMoves.forEach((move) => {
                        let x = move[0];
                        let y = move[1];

                        if (white.includes(board[x][y])) {
                            endRow = x;
                            endCol = y;
                        }
                    })
                }
            }
        }

        // If no attack was found, do a random move with a random piece
        if (endRow || endCol === null) {
            let randomPos = blackPiecesIndexes[Math.floor(Math.random() * blackPiecesIndexes.length)];
            piece = board[randomPiece[0]][randomPiece[1]];
            startRow = randomPiece[0];
            startCol = randomPiece[1];

            let validMoves = getValidMoves(piece, randomPos, 'black');
            let randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];

            endRow = randomMove[0];
            endCol = randomMove[1];
        }

        movePieceBlack(piece, startRow, startCol, endRow, endCol);
    }

    console.log("CHECKMATE")

}