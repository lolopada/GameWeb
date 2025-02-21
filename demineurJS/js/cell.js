class Cell {
    constructor(row, col, board) {
        this.row = row;
        this.col = col;
        this.board = board;
        this.isMine = false;
        this.isRevealed = false; // Ajout de la propriété isRevealed
        this.adjacentMines = 0;
        this.element = document.createElement('div');
        this.element.classList.add('cell');
        this.element.addEventListener('click', () => this.handleClick());
    }

    reveal() {
        if (this.isRevealed) return; // Ne rien faire si déjà révélée
        
        this.isRevealed = true; // Marquer la cellule comme révélée
        this.element.classList.add('revealed');
        
        if (this.adjacentMines > 0) {
            this.element.textContent = this.adjacentMines;
            this.element.setAttribute('data-number', this.adjacentMines);
        }
    }

    toggleFlag() {
        this.isFlagged = !this.isFlagged;
    }

    handleClick() {
        // Si la cellule est déjà révélée, ne rien faire
        if (this.isRevealed) {
            return;
        }

        // Si c'est une mine
        if (this.isMine) {
            this.reveal();
            this.element.classList.add('mine');
            this.element.textContent = '💣';
            this.board.gameOver();
            return;
        }

        // Révéler la cellule
        this.reveal();

        // Si c'est une cellule vide, propager aux cellules adjacentes
        if (this.adjacentMines === 0) {
            this.board.revealAdjacentCells(this.row, this.col);
        }

        // Vérifier la victoire
        this.board.checkWin();
    }
}