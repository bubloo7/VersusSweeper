const seedrandom = require("seedrandom");

/**
 * Generates the minesweeper board as soon as the first square is clicked
 * @param {int} rows number of rows
 * @param {int} cols number of columns
 * @param {int} numMines number of mines
 * @param {string} seed seed used for random generation
 * @param {int} firstRowClick first row that was clicked
 * @param {int} firstColClick first column that was clicked
 * @returns rows x cols board with numMines mines. -1 means mine, 0 means no mines nearby, 1 means 1 mine nearby, etc.
 *          (firstRowClick,firstColClick) and its neighbors are guaranteed to not be mines
 */
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

/**
 * Used as a helper function for getBoard
 * @param {int} row number of rows
 * @param {int} col number of columns
 * @param {int[][]} board board. -1 means mine, 0 means its not a mine
 * @returns number of mines nearby or -1 if mine
 */
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

/**
 * Logic for revealing a square. Modifies revealed and flagged arrays
 * @param {int} row number of rows
 * @param {int} col number of columns
 * @param {int[][]} minesweeperBoard board in format of getBoard()
 * @param {bool[][]} revealed bool array of revealed squares
 * @param {bool[][]} flagged bool array of flagged squares
 * @param {int} stun time till player can click again
 * @returns [number of squares revealed, number of mines hit]
 */
function reveal(row, col, minesweeperBoard, revealed, flagged, stun) {
    let output = [0, 0, []];
    if (
        row >= 0 &&
        row < minesweeperBoard.length &&
        col >= 0 &&
        col < minesweeperBoard[0].length &&
        !revealed[row][col] &&
        !flagged[row][col]
    ) {
        if (Date.now() < stun) {
            return [0, 0, []];
        }
        revealed[row][col] = true;
        if (minesweeperBoard[row][col] === -1) {
            flagged[row][col] = true;
            return [0, 1, [[row, col]]];
        } else if (minesweeperBoard[row][col] === 0) {
            const [hits1, misses1, indexes1] = reveal(row - 1, col - 1, minesweeperBoard, revealed, flagged, stun);
            const [hits2, misses2, indexes2] = reveal(row - 1, col, minesweeperBoard, revealed, flagged, stun);
            const [hits3, misses3, indexes3] = reveal(row - 1, col + 1, minesweeperBoard, revealed, flagged, stun);
            const [hits4, misses4, indexes4] = reveal(row, col - 1, minesweeperBoard, revealed, flagged, stun);
            const [hits5, misses5, indexes5] = reveal(row, col + 1, minesweeperBoard, revealed, flagged, stun);
            const [hits6, misses6, indexes6] = reveal(row + 1, col - 1, minesweeperBoard, revealed, flagged, stun);
            const [hits7, misses7, indexes7] = reveal(row + 1, col, minesweeperBoard, revealed, flagged, stun);
            const [hits8, misses8, indexes8] = reveal(row + 1, col + 1, minesweeperBoard, revealed, flagged, stun);
            output[0] = hits1 + hits2 + hits3 + hits4 + hits5 + hits6 + hits7 + hits8;
            output[2] = indexes1.concat(indexes2, indexes3, indexes4, indexes5, indexes6, indexes7, indexes8);
        }
        output[0] += 1;
        output[2].push([row, col]);
    }
    return output;
}

/**
 * Logic for middle mouse click. Modifies revealed and flagged arrays
 * @param {int} row number of rows
 * @param {int} col number of columns
 * @param {int[][]} minesweeperBoard board in format of getBoard()
 * @param {bool[][]} revealed bool array of revealed squares
 * @param {bool[][]} flagged bool array of flagged squares
 * @param {int} stun time till player can click again
 * @returns [number of squares revealed, number of mines hit]
 */
function middleClick(row, col, minesweeperBoard, revealed, flagged, stun) {
    if (revealed[row][col]) {
        if (Date.now() < stun) {
            return [0, 0, []];
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
            let revealedIndexes = [];
            let [hits1, misses1, indexes1] = reveal(row - 1, col - 1, minesweeperBoard, revealed, flagged, stun);
            if (misses1 > 0) {
                return [hits, 1, revealedIndexes];
            }
            hits += hits1;
            revealedIndexes = revealedIndexes.concat(indexes1);
            [hits1, misses1, indexes1] = reveal(row - 1, col, minesweeperBoard, revealed, flagged, stun);
            if (misses1 > 0) {
                return [hits, 1, revealedIndexes];
            }
            hits += hits1;
            revealedIndexes = revealedIndexes.concat(indexes1);
            [hits1, misses1, indexes1] = reveal(row - 1, col + 1, minesweeperBoard, revealed, flagged, stun);
            if (misses1 > 0) {
                return [hits, 1, revealedIndexes];
            }
            hits += hits1;
            revealedIndexes = revealedIndexes.concat(indexes1);
            [hits1, misses1, indexes1] = reveal(row, col - 1, minesweeperBoard, revealed, flagged, stun);
            if (misses1 > 0) {
                return [hits, 1, revealedIndexes];
            }
            hits += hits1;
            revealedIndexes = revealedIndexes.concat(indexes1);
            [hits1, misses1, indexes1] = reveal(row, col + 1, minesweeperBoard, revealed, flagged, stun);
            if (misses1 > 0) {
                return [hits, 1, revealedIndexes];
            }
            hits += hits1;
            revealedIndexes = revealedIndexes.concat(indexes1);
            [hits1, misses1, indexes1] = reveal(row + 1, col - 1, minesweeperBoard, revealed, flagged, stun);
            if (misses1 > 0) {
                return [hits, 1, revealedIndexes];
            }
            hits += hits1;
            revealedIndexes = revealedIndexes.concat(indexes1);
            [hits1, misses1, indexes1] = reveal(row + 1, col, minesweeperBoard, revealed, flagged, stun);
            if (misses1 > 0) {
                return [hits, 1, revealedIndexes];
            }
            hits += hits1;
            revealedIndexes = revealedIndexes.concat(indexes1);
            [hits1, misses1, indexes1] = reveal(row + 1, col + 1, minesweeperBoard, revealed, flagged, stun);
            if (misses1 > 0) {
                return [hits, 1, revealedIndexes];
            }
            hits += hits1;
            revealedIndexes = revealedIndexes.concat(indexes1);
            return [hits, 0, revealedIndexes];
        }
    }
    return [0, 0, []];
}

function flag(row, col, flagged) {
    flagged[row][col] = !flagged[row][col];
}
export { getBoard, reveal, middleClick, flag };
