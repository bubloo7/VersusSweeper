const seedrandom = require("seedrandom");

function getBoard(rows, cols, numMines, seed, firstRowClick, firstColClick) {
    const board = [];
    for (let i = 0; i < rows; i++) {
        board.push([]);
        for (let j = 0; j < cols; j++) {
            board[i].push(0);
        }
    }
    const rng = seedrandom(seed);
    let minesRemaining = numMines;

    while (minesRemaining > 0) {
        const row = Math.floor(rng() * rows);
        const col = Math.floor(rng() * cols);
        if (board[row][col] === 0 && (Math.abs(row - firstRowClick) > 1 || Math.abs(col - firstColClick) > 1)) {
            board[row][col] = -1;
            minesRemaining--;
        }
    }

    const boardWithNeighbors = [];
    for (let i = 0; i < board.length; i++) {
        boardWithNeighbors.push([]);
        for (let j = 0; j < board[0].length; j++) {
            boardWithNeighbors[i].push(getNeighbors(i, j, board));
        }
    }

    return boardWithNeighbors;
}

// returns number of mines nearby or -1 if mine
function getNeighbors(row, col, board) {
    if (row >= 0 && row < board.length && col >= 0 && col < board[0].length && board[row][col] === -1) {
        return -1;
    }
    let neighbors = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (
                row + i >= 0 &&
                row + i < board.length &&
                col + j >= 0 &&
                col + j < board[0].length &&
                board[row + i][col + j] === -1
            ) {
                neighbors++;
            }
        }
    }
    return neighbors;
}

function reveal(row, col, minesweeperBoard, revealed, flagged, stun) {
    let output = [0, 0];
    if (
        row >= 0 &&
        row < minesweeperBoard.length &&
        col >= 0 &&
        col < minesweeperBoard[0].length &&
        !revealed[row][col] &&
        !flagged[row][col]
    ) {
        if (Date.now() < stun) {
            return [0, 0];
        }
        revealed[row][col] = true;
        if (minesweeperBoard[row][col] === -1) {
            // tbd stun
            flagged[row][col] = true;
            return [0, 1];
        } else if (minesweeperBoard[row][col] === 0) {
            let [hits1] = reveal(row - 1, col - 1, minesweeperBoard, revealed, flagged, stun);
            let [hits2] = reveal(row - 1, col, minesweeperBoard, revealed, flagged, stun);
            let [hits3] = reveal(row - 1, col + 1, minesweeperBoard, revealed, flagged, stun);
            let [hits4] = reveal(row, col - 1, minesweeperBoard, revealed, flagged, stun);
            let [hits5] = reveal(row, col + 1, minesweeperBoard, revealed, flagged, stun);
            let [hits6] = reveal(row + 1, col - 1, minesweeperBoard, revealed, flagged, stun);
            let [hits7] = reveal(row + 1, col, minesweeperBoard, revealed, flagged, stun);
            let [hits8] = reveal(row + 1, col + 1, minesweeperBoard, revealed, flagged, stun);
            output[0] = hits1 + hits2 + hits3 + hits4 + hits5 + hits6 + hits7 + hits8;
        }
        output[0] += 1;
    }
    return output;
}
function middleClick(row, col, minesweeperBoard, revealed, flagged, stun) {
    if (
        row >= 0 &&
        row < minesweeperBoard.length &&
        col >= 0 &&
        col < minesweeperBoard[0].length &&
        revealed[row][col]
    ) {
        if (Date.now() < stun) {
            return [0, 0];
        }
        let neighbors = 0;
        if (row - 1 >= 0 && col - 1 >= 0 && flagged[row - 1][col - 1]) {
            neighbors++;
        }
        if (row - 1 >= 0 && flagged[row - 1][col]) {
            neighbors++;
        }
        if (row - 1 >= 0 && col + 1 < minesweeperBoard[0].length && flagged[row - 1][col + 1]) {
            neighbors++;
        }
        if (col - 1 >= 0 && flagged[row][col - 1]) {
            neighbors++;
        }
        if (col + 1 < minesweeperBoard[0].length && flagged[row][col + 1]) {
            neighbors++;
        }
        if (row + 1 < minesweeperBoard.length && col - 1 >= 0 && flagged[row + 1][col - 1]) {
            neighbors++;
        }
        if (row + 1 < minesweeperBoard.length && flagged[row + 1][col]) {
            neighbors++;
        }
        if (row + 1 < minesweeperBoard.length && col + 1 < minesweeperBoard[0].length && flagged[row + 1][col + 1]) {
            neighbors++;
        }
        if (neighbors === minesweeperBoard[row][col]) {
            let hits = 0;
            const [hits1, misses1] = reveal(row - 1, col - 1, minesweeperBoard, revealed, flagged, stun);
            if (misses1 > 0) {
                return [hits, 1];
            }
            hits += hits1;
            const [hits2, misses2] = reveal(row - 1, col, minesweeperBoard, revealed, flagged, stun);
            if (misses2 > 0) {
                return [hits, 1];
            }
            hits += hits2;
            const [hits3, misses3] = reveal(row - 1, col + 1, minesweeperBoard, revealed, flagged, stun);
            if (misses3 > 0) {
                return [hits, 1];
            }
            hits += hits3;
            const [hits4, misses4] = reveal(row, col - 1, minesweeperBoard, revealed, flagged, stun);
            if (misses4 > 0) {
                return [hits, 1];
            }
            hits += hits4;
            const [hits5, misses5] = reveal(row, col + 1, minesweeperBoard, revealed, flagged, stun);
            if (misses5 > 0) {
                return [hits, 1];
            }
            hits += hits5;
            const [hits6, misses6] = reveal(row + 1, col - 1, minesweeperBoard, revealed, flagged, stun);
            if (misses6 > 0) {
                return [hits, 1];
            }
            hits += hits6;
            const [hits7, misses7] = reveal(row + 1, col, minesweeperBoard, revealed, flagged, stun);
            if (misses7 > 0) {
                return [hits, 1];
            }
            hits += hits7;
            const [hits8, misses8] = reveal(row + 1, col + 1, minesweeperBoard, revealed, flagged, stun);
            if (misses8 > 0) {
                return [hits, 1];
            }
            hits += hits8;
            return [hits, 0];
        }
    }
    return [0, 0];
}

function flag(row, col, flagged) {
    flagged[row][col] = !flagged[row][col];
}
export { getBoard, reveal, middleClick, flag };
// const minesweeperBoard = getBoard(10, 10, 10, "see2dd", 0, 0);
// const revealed = [];
// const flagged = [];

// for (let i = 0; i < minesweeperBoard.length; i++) {
//     revealed.push([]);
//     flagged.push([]);
//     for (let j = 0; j < minesweeperBoard[0].length; j++) {
//         revealed[i].push(false);
//         flagged[i].push(false);
//     }
// }

// console.log();
// for (let i = 0; i < minesweeperBoard.length; i++) {
//     console.log(minesweeperBoard[i].toString());
// }

// reveal(0, 0, minesweeperBoard, revealed, flagged);

// console.log();
// for (let i = 0; i < revealed.length; i++) {
//     console.log(revealed[i].toString());
// }
