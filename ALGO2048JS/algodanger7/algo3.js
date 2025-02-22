const DEPTH = 7; 
const PROBABILITY_2 = 0.9; // Probabilité d'avoir un 2
const PROBABILITY_4 = 0.1; // Probabilité d'avoir un 4

// Simplifier la fonction d'évaluation
function evaluateBoard() {
    let score = 0;
    const weights = [
        [4.0, 3.0, 2.0, 1.0],
        [3.0, 2.0, 1.0, 0.0],
        [2.0, 1.0, 0.0, -1.0],
        [1.0, 0.0, -1.0, -2.0]
    ];

    // Évalue uniquement la position des tuiles avec des poids
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            score += findCell(x, y).getValue() * weights[y][x];
        }
    }

    // Bonus simplifié pour les espaces vides
    const emptyCells = cells.filter(cell => cell.getValue() === 0).length;
    score += emptyCells * 100;

    return score;
}

function expectimax(depth, isMax) {
    if (depth === 0 || checkGameOver()) {
        return evaluateBoard();
    }

    if (isMax) {
        let bestScore = -Infinity;
        const moves = ['up', 'down', 'left', 'right'];
        
        for (const move of moves) {
            const boardState = cells.map(cell => cell.getValue());
            
            // Ne considérer que le 2 et le 4 pour les nouvelles tuiles
            switch(move) {
                case 'up': moveUpElement(); break;
                case 'down': moveDownElement(); break;
                case 'left': moveLeftElement(); break;
                case 'right': moveRightElement(); break;
            }
            
            const score = expectimax(depth - 1, false);
            cells.forEach((cell, index) => cell.setValue(boardState[index]));
            
            if (score > bestScore) {
                bestScore = score;
            }
        }
        return bestScore;
    } else {
        // Simplifier la partie chance en ne considérant que les tuiles 2 et 4
        let score = 0;
        const emptyCells = cells.filter(cell => cell.getValue() === 0);
        
        if (emptyCells.length === 0) return evaluateBoard();
        
        // Prendre un échantillon aléatoire des cellules vides pour réduire les calculs
        const sampleSize = Math.min(2, emptyCells.length);
        const sampledCells = emptyCells.slice(0, sampleSize);
        
        for (const cell of sampledCells) {
            // Ne considérer que le 2 et le 4
            cell.setValue(2);
            score += 0.7 * expectimax(depth - 1, true); // 70% chance pour 2
            
            cell.setValue(4);
            score += 0.3 * expectimax(depth - 1, true); // 30% chance pour 4
            
            cell.setValue(0);
        }
        
        return score / sampleSize;
    }
}

async function startAlgo() {
    let totalMoves = 0;
    let previousState = '';
    let repeatedStates = 0;

    while (!checkGameOverAlgo()) {
        let bestMove = '';
        let bestScore = -Infinity;
        const moves = ['up', 'down', 'left', 'right'];
        
        // Clone current board state
        const boardState = cells.map(cell => cell.getValue());
        const currentState = boardState.join(',');

        // Vérifier si l'état est répété
        if (currentState === previousState) {
            repeatedStates++;
            if (repeatedStates >= 3) {
                console.log("État répété détecté - Arrêt de l'algorithme");
                break;
            }
        } else {
            repeatedStates = 0;
        }
        previousState = currentState;
        
        for (const move of moves) {
            switch(move) {
                case 'up': moveUpElement(); break;
                case 'down': moveDownElement(); break;
                case 'left': moveLeftElement(); break;
                case 'right': moveRightElement(); break;
            }
            
            const score = expectimax(DEPTH, false);
            
            // Restore board state
            cells.forEach((cell, index) => cell.setValue(boardState[index]));
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        
        console.log("Meilleur mouvement:", bestMove, "Score:", bestScore);
        
        // Execute best move
        switch(bestMove) {
            case 'up': moveUpElement(); break;
            case 'down': moveDownElement(); break;
            case 'left': moveLeftElement(); break;
            case 'right': moveRightElement(); break;
        }

        totalMoves++;
        await new Promise(resolve => setTimeout(resolve, 10));
    }

    // Afficher le popup à la fin du jeu
    popUpAlgoOver(totalMoves);
}

function popUpAlgoOver(moves) {
    const existingPopup = document.querySelector('.popup');
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
      <div class="popup-content">
          <h2>Algorithme terminé !</h2>
          <p>Nombre de combinaisons : ${moves}</p>
          <button id="restart-btn" class="rbtn">Fermer</button>
      </div>
    `;
    document.body.appendChild(popup);

    const restartGameBtn = document.querySelector('.rbtn');
    restartGameBtn.addEventListener('click', () => {
        popup.remove();
    });
}

function checkGameOverAlgo() {
    // Vérifier s'il y a des cases vides
    const hasEmptyCell = cells.some(cell => cell.getValue() === 0);
    if (hasEmptyCell) return false;

    // Vérifier les mouvements possibles horizontalement
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 3; x++) {
            const current = findCell(x, y).getValue();
            const next = findCell(x + 1, y).getValue();
            if (current === next) return false;
        }
    }

    // Vérifier les mouvements possibles verticalement
    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 3; y++) {
            const current = findCell(x, y).getValue();
            const next = findCell(x, y + 1).getValue();
            if (current === next) return false;
        }
    }

    return true;
}

startAlgo();