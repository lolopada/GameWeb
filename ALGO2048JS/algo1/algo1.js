// Cet algorithme analyse la grille pour compter les fusions possibles horizontalement et verticalement. 
// Il effectue ensuite des déplacements en priorisant la direction avec le plus de fusions possibles, 
// jusqu'à la fin du jeu.

function countPossibleMerges() {
    let horizontalMergeCount = 0;
    let verticalMergeCount = 0;
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
                    break; // Found a merge, no need to check further vertically
                } else {
                    break; // Different value, no merge possible in this direction
                }
            }
        }
    }
    return { horizontal: horizontalMergeCount, vertical: verticalMergeCount };
}

const merges = countPossibleMerges();
console.log("Nombre de merges horizontaux : " + merges.horizontal);
console.log("Nombre de merges verticaux : " + merges.vertical);

async function startAlgo() {
    let UpOrDown = 0;
    let LeftOrRight = 0;
    let totalMoves = 0;

    while (!checkGameOver()) {
        const merges = countPossibleMerges();

        if (merges.horizontal > merges.vertical) {
            console.log("Horizontal merges are more than vertical merges");
            if (LeftOrRight == 0) {
                console.log("Moving left");
                moveLeftElement();
                LeftOrRight = 1;
            } else {
                console.log("Moving right");
                moveRightElement();
                LeftOrRight = 0;
            }
        } else if (merges.horizontal < merges.vertical) {
            console.log("Vertical merges are more than horizontal merges");
            if (UpOrDown == 0) {
                console.log("Moving up");
                moveUpElement();
                UpOrDown = 1;
            } else {
                console.log("Moving down");
                moveDownElement();
                UpOrDown = 0;
            }
        } else if (merges.horizontal == merges.vertical) {
            console.log("Horizontal and Vertical merges are equal");
            const randomDirection = Math.floor(Math.random() * 2);
            if (randomDirection == 1) {
                console.log("Randomly chose horizontal");
                if (LeftOrRight == 0) {
                    console.log("Moving left");
                    moveLeftElement();
                    LeftOrRight = 1;
                } else {
                    console.log("Moving right");
                    moveRightElement();
                    LeftOrRight = 0;
                }
            } else {
                console.log("Randomly chose vertical");
                if (UpOrDown == 0) {
                    console.log("Moving up");
                    moveUpElement();
                    UpOrDown = 1;
                } else {
                    console.log("Moving down");
                    moveDownElement();
                    UpOrDown = 0;
                }
            }
        }
        totalMoves++;
        await new Promise(resolve => setTimeout(resolve, 50));
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
