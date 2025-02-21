class Game {
    constructor(rows = 10, cols = 10, mines = 10) {
        this.board = new Board(rows, cols, mines);
        this.gameBoard = document.getElementById('game-board');
        this.status = document.getElementById('status');
        this.init();
    }

    init() {
        // Définir la grille en fonction du nombre de colonnes
        this.gameBoard.style.gridTemplateColumns = `repeat(${this.board.cols}, 35px)`;
        this.renderBoard();
        document.getElementById('restart-button').addEventListener('click', (e) => {
            e.preventDefault(); // Empêcher le comportement par défaut
            this.restart();
        });
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';
        for (let i = 0; i < this.board.rows; i++) {
            for (let j = 0; j < this.board.cols; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                cell.addEventListener('click', (e) => this.handleClick(e));
                cell.addEventListener('contextmenu', (e) => this.handleRightClick(e));
                
                this.updateCellDisplay(cell, this.board.grid[i][j]);
                this.gameBoard.appendChild(cell);
            }
        }
    }

    updateCellDisplay(cellElement, cell) {
        if (cell.isRevealed) {
            cellElement.classList.add('revealed');
            if (cell.isMine) {
                cellElement.classList.add('mine');
                cellElement.textContent = '💣';
            } else if (cell.neighborMines > 0) {
                // Ajouter l'attribut data-number pour la couleur
                cellElement.setAttribute('data-number', cell.neighborMines);
                cellElement.textContent = cell.neighborMines;
            }
        } else if (cell.isFlagged) {
            cellElement.textContent = '🚩';
        } else {
            cellElement.textContent = '';
            // Supprimer l'attribut data-number si la cellule n'est pas révélée
            cellElement.removeAttribute('data-number');
        }
    }

    handleClick(e) {
        e.preventDefault();
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        
        if (this.board.gameOver) return;
        
        // Get the clicked cell
        const cell = this.board.grid[row][col];
        
        // If it's a mine, game over
        if (cell.isMine) {
            this.board.reveal(row, col);
            this.gameOver(false);
        } else {
            // Otherwise reveal the cell and check for win
            this.board.reveal(row, col);
            if (this.board.checkWin()) {
                this.gameOver(true);
            }
        }
        
        this.renderBoard();
    }

    handleRightClick(e) {
        e.preventDefault();
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        
        if (this.board.gameOver) return;
        
        this.board.toggleFlag(row, col);
        this.renderBoard();
    }

    gameOver(won) {
        this.board.gameOver = true;
        this.status.textContent = won ? 'You Win! 🎉' : 'Game Over! 💥';
    }

    restart() {
        // Au lieu de recréer directement une nouvelle partie,
        // on supprime l'instance actuelle et on affiche le popup
        this.gameBoard.innerHTML = '';
        this.status.textContent = '';
        game = null; // On réinitialise la variable globale
        showGameSetupPopup(); // On affiche le popup de configuration
    }
}

let game; // Variable globale pour stocker l'instance du jeu

function initGame(size, bombs) {
    // Créer une nouvelle instance du jeu avec les paramètres choisis
    game = new Game(size, size, bombs);
}

function showGameSetupPopup() {
    // Supprimer tout popup existant
    const existingPopup = document.querySelector('.popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h2>Configuration du jeu</h2>
            <div class="form-group">
                <label for="gridSize">Taille de la grille (5-20) :</label>
                <input type="number" id="gridSize" min="5" max="20" value="10">
            </div>
            <div class="form-group">
                <label for="bombCount">Nombre de bombes :</label>
                <input type="number" id="bombCount" min="1" value="10">
            </div>
            <button id="startGame">Commencer</button>
        </div>
    `;

    document.body.appendChild(popup);

    const gridSizeInput = document.getElementById('gridSize');
    const bombCountInput = document.getElementById('bombCount');
    const startButton = document.getElementById('startGame');

    // Fonction de nettoyage des event listeners
    const cleanup = () => {
        gridSizeInput.removeEventListener('change', handleGridSizeChange);
        startButton.removeEventListener('click', handleStartGame);
    };

    // Définir les fonctions de gestionnaire d'événements
    const handleGridSizeChange = () => {
        let size = parseInt(gridSizeInput.value);
        
        // Forcer les limites
        if (size < 5) size = 5;
        if (size > 20) size = 20;
        gridSizeInput.value = size;

        // Mettre à jour le nombre de bombes
        const defaultBombs = Math.floor((size * size) * 0.1);
        const maxBombs = Math.floor((size * size) * 0.35);
        
        bombCountInput.value = defaultBombs;
        bombCountInput.max = maxBombs;
    };

    const handleStartGame = () => {
        const size = parseInt(gridSizeInput.value);
        const bombs = parseInt(bombCountInput.value);

        // Validation finale avant de démarrer
        if (size < 5 || size > 20) {
            alert('La taille de la grille doit être entre 5 et 20 !');
            return;
        }
        
        if (bombs >= size * size) {
            alert('Trop de bombes pour cette taille de grille !');
            return;
        }

        cleanup(); // Nettoyer les event listeners
        initGame(size, bombs);
        popup.remove();
    };

    // Ajouter les event listeners
    gridSizeInput.addEventListener('change', handleGridSizeChange);
    startButton.addEventListener('click', handleStartGame);
}

// Ne garder que cette ligne pour le chargement initial
window.addEventListener('load', showGameSetupPopup);