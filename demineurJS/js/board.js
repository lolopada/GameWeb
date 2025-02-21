class Board {
    constructor(rows, cols, mines) {
        this.rows = rows;
        this.cols = cols;
        this.mines = mines;
        this.grid = [];
        this.gameOver = false;
        this.revealed = 0;
        this.initialize();
    }

    initialize() {
        // Create grid
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j] = new Cell(i, j);
            }
        }

        // Place mines
        let minesPlaced = 0;
        while (minesPlaced < this.mines) {
            const row = Utils.randomInt(0, this.rows - 1);
            const col = Utils.randomInt(0, this.cols - 1);
            if (!this.grid[row][col].isMine) {
                this.grid[row][col].isMine = true;
                minesPlaced++;
            }
        }

        // Calculate neighbor mines
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (!this.grid[i][j].isMine) {
                    const neighbors = Utils.getNeighbors(i, j, this.rows, this.cols);
                    this.grid[i][j].neighborMines = neighbors.reduce((count, [row, col]) => 
                        count + (this.grid[row][col].isMine ? 1 : 0), 0);
                }
            }
        }
    }

    reveal(row, col) {
        const cell = this.grid[row][col];
        if (cell.isRevealed || cell.isFlagged) return;

        cell.reveal();
        this.revealed++;

        if (cell.isMine) {
            this.gameOver = true;
            return false;
        }

        if (cell.neighborMines === 0) {
            const neighbors = Utils.getNeighbors(row, col, this.rows, this.cols);
            neighbors.forEach(([r, c]) => this.reveal(r, c));
        }

        return true;
    }

    revealAdjacentCells(row, col) {
        // Get all adjacent cells
        const adjacentCells = [
            [row-1, col-1], [row-1, col], [row-1, col+1],
            [row, col-1],                 [row, col+1],
            [row+1, col-1], [row+1, col], [row+1, col+1]
        ];

        // Check each adjacent cell
        for (let [r, c] of adjacentCells) {
            // Verify the cell is within bounds
            if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                const cell = this.cells[r][c];
                // Only reveal if not already revealed and not a mine
                if (!cell.isRevealed && !cell.isMine) {
                    cell.reveal();
                    // If this is also an empty cell, recursively reveal its neighbors
                    if (cell.adjacentMines === 0) {
                        this.revealAdjacentCells(r, c);
                    }
                }
            }
        }
    }

    gameOver() {
        // Reveal all mines
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.cells[row][col];
                if (cell.isMine) {
                    cell.element.classList.add('mine');
                    cell.element.textContent = '💣';
                }
            }
        }
        // Update status
        const status = document.getElementById('status');
        status.textContent = 'Game Over!';
    }

    toggleFlag(row, col) {
        const cell = this.grid[row][col];
        if (!cell.isRevealed) {
            cell.toggleFlag();
        }
    }

    checkWin() {
        return this.revealed === (this.rows * this.cols - this.mines);
    }
}