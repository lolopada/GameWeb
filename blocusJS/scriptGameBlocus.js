// Sélectionne les éléments de la grille et du message d'erreur
const gridElement = document.querySelector('.grid');
const errorMessageElement = document.querySelector('.error-message');
let currentPlayer = 1;
let gridSize; // La taille sera définie par le choix du joueur
let grid;
let gamePhase = 'placement';
let playerPositions = {
  1: null,
  2: null
};

// Initialise le jeu avec la taille de grille spécifiée
function initGame(size) {
  gridSize = size;
  grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
  createGrid();
  updatePhaseIndicator();
}

// Affiche une boîte de dialogue pour choisir la taille de la grille
function showGridSizeDialog() {
  const dialog = document.createElement('div');
  dialog.innerHTML = `
    <div class="grid-size-dialog">
      <h2>Choisissez la taille de la grille</h2>
      <div class="size-options">
        <button onclick="selectGridSize(5)">5 x 5</button>
        <button onclick="selectGridSize(7)">7 x 7</button>
        <button onclick="selectGridSize(9)">9 x 9</button>
        <button onclick="selectGridSize(12)">12 x 12</button>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
}

// Sélectionne la taille de la grille et initialise le jeu
function selectGridSize(size) {
  document.querySelector('.grid-size-dialog').remove();
  initGame(size);
}

// Vérifie si deux cellules sont adjacentes
function isAdjacent(row1, col1, row2, col2) {
  return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1;
}

// Obtient les mouvements valides pour une cellule donnée
function getValidMoves(row, col) {
  const moves = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (
        newRow >= 0 && newRow < gridSize &&
        newCol >= 0 && newCol < gridSize &&
        grid[newRow][newCol] !== 'wall' &&
        !(grid[newRow][newCol] === 1 || grid[newRow][newCol] === 2)
      ) {
        moves.push([newRow, newCol]);
      }
    }
  }
  return moves;
}

// Vérifie si un joueur est bloqué
function isPlayerBlocked(playerNum) {
  const pos = playerPositions[playerNum];
  if (!pos) return false;
  return getValidMoves(pos[0], pos[1]).length === 0;
}

// Vérifie si un joueur a gagné
function checkWinner() {
  if (isPlayerBlocked(1)) {
    const winner = 2;
    document.querySelector('.winner-message').style.display = 'block';
    document.querySelector('.winner-text').textContent = `Joueur ${winner} a gagné!`;
    return true;
  }
  if (isPlayerBlocked(2)) {
    const winner = 1;
    document.querySelector('.winner-message').style.display = 'block';
    document.querySelector('.winner-text').textContent = `Joueur ${winner} a gagné!`;
    return true;
  }
  return false;
}

// Crée la grille de jeu
function createGrid() {
  gridElement.innerHTML = '';
  const cellSize = Math.min(60, 400 / gridSize); // Ajuste la taille des cellules en fonction de la taille de la grille
  gridElement.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;
  gridElement.style.gridTemplateRows = `repeat(${gridSize}, ${cellSize}px)`;
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (grid[row][col] === 1 || grid[row][col] === 2) {
        const circle = document.createElement('div');
        circle.classList.add('circle', grid[row][col] === 1 ? 'blue' : 'red');
        cell.appendChild(circle);
      } else if (grid[row][col] === 'wall') {
        cell.classList.add('wall');
      }

      cell.addEventListener('click', () => handleCellClick(row, col));
      gridElement.appendChild(cell);
    }
  }
  updatePhaseIndicator();
}

// Obtient un élément aléatoire d'un tableau
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Effectue un mouvement pour le bot
async function makeBotMove() {
  if (gamePhase === 'placement') {
    const emptyCells = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (!grid[row][col]) {
          emptyCells.push([row, col]);
        }
      }
    }
    const [row, col] = getRandomElement(emptyCells);
    await new Promise(resolve => setTimeout(resolve, 500));
    handleCellClick(row, col);
  } else if (gamePhase === 'movement') {
    const playerPos = playerPositions[2];
    const validMoves = getValidMoves(playerPos[0], playerPos[1]);
    const [row, col] = getRandomElement(validMoves);
    await new Promise(resolve => setTimeout(resolve, 500));
    handleCellClick(row, col);
  } else if (gamePhase === 'wall') {
    const emptyCells = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (!grid[row][col]) {
          emptyCells.push([row, col]);
        }
      }
    }
    const [row, col] = getRandomElement(emptyCells);
    await new Promise(resolve => setTimeout(resolve, 500));
    handleCellClick(row, col);
  }
}

// Gère le clic sur une cellule
function handleCellClick(row, col) {
  if (grid[row][col] === 'wall') {
    showError('Cette case contient déjà un mur !');
    return;
  }

  if (gamePhase === 'placement') {
    if (grid[row][col]) {
      showError('Cette case est déjà occupée !');
      return;
    }
    grid[row][col] = currentPlayer;
    playerPositions[currentPlayer] = [row, col];
    
    if (playerPositions[1] && playerPositions[2]) {
      gamePhase = 'movement';
    }
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    createGrid();
    updatePhaseIndicator();
    if (currentPlayer === 2) {
      makeBotMove();
    }
  } else if (gamePhase === 'movement') {
    if (checkWinner()) return;
    
    const playerPos = playerPositions[currentPlayer];
    if (!isAdjacent(playerPos[0], playerPos[1], row, col)) {
      showError('Vous devez vous déplacer sur une case adjacente !');
      return;
    }
    if (grid[row][col] === 1 || grid[row][col] === 2) {
      showError('Cette case est déjà occupée !');
      return;
    }
    grid[playerPos[0]][playerPos[1]] = null;
    grid[row][col] = currentPlayer;
    playerPositions[currentPlayer] = [row, col];
    gamePhase = 'wall';
    createGrid();
    updatePhaseIndicator();
    if (currentPlayer === 2) {
      makeBotMove();
    }
  } else if (gamePhase === 'wall') {
    if (grid[row][col]) {
      showError('Cette case est déjà occupée !');
      return;
    }
    grid[row][col] = 'wall';
    if (!checkWinner()) {
      gamePhase = 'movement';
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      if (currentPlayer === 2) {
        makeBotMove();
      }
    }
    createGrid();
    updatePhaseIndicator();
  }
}

// Affiche un message d'erreur
function showError(message) {
  const errorElement = document.querySelector('.error-message');
  errorElement.textContent = message;
  errorElement.classList.add('visible');
  
  setTimeout(() => {
    errorElement.classList.remove('visible');
  }, 3000);
}

// Met à jour l'indicateur de phase de jeu
function updatePhaseIndicator() {
  const phaseIndicatorElement = document.querySelector('.phase-indicator');
  
  if (gamePhase === 'placement') {
    phaseIndicatorElement.textContent = "Placez votre pion sur la grille";
  } else if (currentPlayer === 2) {
    phaseIndicatorElement.textContent = "Joueur 2 joue...";
  } else {
    if (gamePhase === 'movement') {
      phaseIndicatorElement.textContent = "Joueur 1 : Déplacez votre pion";
    } else if (gamePhase === 'wall') {
      phaseIndicatorElement.textContent = "Joueur 1 : Placez un mur";
    }
  }
}

// Redémarre le jeu
document.querySelector('.restart-btn').addEventListener('click', () => {
  location.reload();
});

// Affiche la boîte de dialogue pour choisir la taille de la grille au début
showGridSizeDialog();