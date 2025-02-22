// Cet algorithme cherche la meilleure fusion possible sur la grille et effectue un mouvement en alternant 
// entre gauche/droite ou haut/bas pour optimiser les combinaisons. 
// S'il ne trouve aucune fusion possible, il choisit un mouvement aléatoire jusqu'à la fin de la partie.

function countPossibleMerges() {
    let horizontalMergeCount = 0;
    let verticalMergeCount = 0;
    let horizontalWeightedMergeCount = 0;
    let verticalWeightedMergeCount = 0;
    const numRows = 4;
    const numCols = 4;

    for (let y = 0; y < numRows; y++) {
        for (let x = 0; x < numCols; x++) {
            const currentCell = findCell(x, y);
            const currentValue = currentCell.getValue();

            if (currentValue === 0) continue;

            // Check horizontal merge with possible empty cells in between
            for (let nextX = x + 1; nextX < numCols; nextX++) {
                const nextCell = findCell(nextX, y);
                const nextValue = nextCell.getValue();

                if (nextValue === 0) continue; // Skip empty cells

                if (nextValue === currentValue) {
                    horizontalMergeCount++;
                    horizontalWeightedMergeCount += currentValue; // Weight by tile value
                    break; // Found a merge, no need to check further horizontally
                } else {
                    break; // Different value, no merge possible in this direction
                }
            }

            // Check vertical merge with possible empty cells in between
            for (let nextY = y + 1; nextY < numRows; nextY++) {
                const nextCell = findCell(x, nextY);
                const nextValue = nextCell.getValue();

                if (nextValue === 0) continue; // Skip empty cells

                if (nextValue === currentValue) {
                    verticalMergeCount++;
                    verticalWeightedMergeCount += currentValue; // Weight by tile value
                    break; // Found a merge, no need to check further vertically
                } else {
                    break; // Different value, no merge possible in this direction
                }
            }
        }
    }
    return {
        horizontal: horizontalMergeCount,
        vertical: verticalMergeCount,
        horizontalWeighted: horizontalWeightedMergeCount,
        verticalWeighted: verticalWeightedMergeCount
    };
}

const merges = countPossibleMerges();
console.log("Nombre de merges horizontaux : " + merges.horizontal);
console.log("Nombre de merges verticaux : " + merges.vertical);

function findBestMerge() {
    let bestMerge = {
        direction: null,
        value: 0
    };
    const numRows = 4;
    const numCols = 4;

    for (let y = 0; y < numRows; y++) {
        for (let x = 0; x < numCols; x++) {
            const currentCell = findCell(x, y);
            const currentValue = currentCell.getValue();

            if (currentValue === 0) continue;

            // Check horizontal merge
            if (x + 1 < numCols) {
                const nextCell = findCell(x + 1, y);
                const nextValue = nextCell.getValue();

                if (nextValue === currentValue && currentValue > bestMerge.value) {
                    bestMerge = {
                        direction: "horizontal",
                        value: currentValue
                    };
                }
            }

            // Check vertical merge
            if (y + 1 < numRows) {
                const nextCell = findCell(x, y + 1);
                const nextValue = nextCell.getValue();

                if (nextValue === currentValue && currentValue > bestMerge.value) {
                    bestMerge = {
                        direction: "vertical",
                        value: currentValue
                    };
                }
            }
        }
    }
    return bestMerge;
}

async function startAlgo() {
    let totalMoves = 0;
    let horizontalDirection = "left"; // Initial horizontal direction
    let verticalDirection = "up"; // Initial vertical direction

    while (!checkGameOver()) {
        const bestMerge = findBestMerge();

        if (bestMerge.direction === "horizontal") {
            console.log("Meilleure fusion : horizontale, valeur : " + bestMerge.value);
            if (horizontalDirection === "left") {
                console.log("Mouvement à gauche");
                moveLeftElement();
                horizontalDirection = "right";
            } else {
                console.log("Mouvement à droite");
                moveRightElement();
                horizontalDirection = "left";
            }
        } else if (bestMerge.direction === "vertical") {
            console.log("Meilleure fusion : verticale, valeur : " + bestMerge.value);
            if (verticalDirection === "up") {
                console.log("Mouvement vers le haut");
                moveUpElement();
                verticalDirection = "down";
            } else {
                console.log("Mouvement vers le bas");
                moveDownElement();
                verticalDirection = "up";
            }
        } else {
            // Si aucune fusion possible, mouvement aléatoire
            console.log("Aucune fusion possible, mouvement aléatoire");
            const randomDirection = Math.floor(Math.random() * 4);
            switch (randomDirection) {
                case 0:
                    console.log("Mouvement à gauche");
                    moveLeftElement();
                    break;
                case 1:
                    console.log("Mouvement à droite");
                    moveRightElement();
                    break;
                case 2:
                    console.log("Mouvement vers le haut");
                    moveUpElement();
                    break;
                case 3:
                    console.log("Mouvement vers le bas");
                    moveDownElement();
                    break;
            }
        }

        totalMoves++;
        await new Promise(resolve => setTimeout(resolve, 10));
    }

    popUpAlgoOver(totalMoves);
}

startAlgo();

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
