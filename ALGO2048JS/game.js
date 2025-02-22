const luckFor2 = 0.6;
const luckFor4 = 0.25;
let cells = [];
let win=0;

//Button
const restartButton = document.querySelector('.play-button');
restartButton.addEventListener('click', () => { window.location.reload(); });

function startGame() {
    initCells();
    setRandomCell(5); //init first cell
    //consolePrintGame();
}
//init all Cell
function initCells() {
    const gameBoard = document.querySelector('.game-board');
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            gameBoard.appendChild(cellElement);
            const cell = new Cell(j, i, cellElement);
            cells.push(cell);
        }
    }
}

function setRandomCell(numberElement) {
    //console.log(`START RANDOM CELL ${numberElement}x:`);
    for (let i = 0; i < numberElement; i++) {
        // Check if there is at least one empty cell
        const availableCells = cells.filter(cell => cell.value === 0);
        if (availableCells.length === 0) {
            //console.log("All cells are taken. Stopping placement.");
            break;
        }
        const randomIndex = getRandomInt(availableCells.length - 1);
        const cell = availableCells[randomIndex];
        //console.log(cell.toString());
        if (Math.random() < luckFor2) {
            cell.setValue(2);
        } else {
            cell.setValue(4);
        } 
    }
    //console.log("END RANDOM CELL.");
}

function consolePrintGame() {
    let gameState = '';
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            const cell = findCell(x, y);
            gameState += cell.getValue() + ' ';
        }
        gameState += '\n';
    }
    //console.log(gameState);
}

//random int between 0 and max
function getRandomInt(max) {
    //Math.floor() : arrondir vers le bas
    //Math.random() 0 - 1
    return Math.floor(Math.random() * (max + 1));
}

//retun element (cell) in tab that meets certain conditions
function findCell(x, y) {
    return cells.find(cell => cell.x === x && cell.y === y);
}

// Function to check if the game is over (no empty cells and no possible merges)
function checkGameOver() {
    // If there is an empty cell, game is not over
    if (cells.some(cell => cell.getValue() === 0)) {
        return false;
    }
    // Loop through the grid to check for possible merges
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            let currentCell = findCell(x, y);
            // Check right cell
            if (x < 3) {
                let rightCell = findCell(x + 1, y);
                if (currentCell.getValue() === rightCell.getValue()) {
                    return false;
                }
            }
            // Check below cell
            if (y < 3) {
                let downCell = findCell(x, y + 1);
                if (currentCell.getValue() === downCell.getValue()) {
                    return false;
                }
            }
        }
    }
    // No empty cells or merges available - game over
    return true;
}

function popUpGameOver() {
    const existingPopup = document.querySelector('.popup');
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
      <div class="popup-content">
          <h2>Vous avez perdu</h2>
          <p>Ce n'est pas grave, vous ferez mieux la prochaine fois.</p>
          <button id="restart-btn" class="rbtn">Rejouer</button>
      </div>
    `;
    document.body.appendChild(popup);

    const restartGameBtn = document.querySelector('.rbtn');
    restartGameBtn.addEventListener('click', () => {
        popup.remove();
        window.location.reload();
    });
}

function checkWin() {
    if (cells.some(cell => cell.getValue() === 2048)) {
        return true;
    } else {
        return false;
    }
}

function popUpWin(){
    const existingPopup = document.querySelector('.popup');
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
      <div class="popup-content">
          <h2>Bravo ! Vous avez gagné !</h2>
          <p>Vous Pouvez continuer votre partie pour atteindre un nombre plus grand, si vous le souhaitez.</p>
          <div class="container-btn-flex">
            <button id="restart-btn" class="continuer-btn">Continuer</button>
            <button id="restart-btn" class="recommencer-btn">Recommencer</button>
          </div>
      </div>
    `;
    document.body.appendChild(popup);

    const continuerBtn = document.querySelector('.continuer-btn');
    continuerBtn.addEventListener('click', () => {
        popup.remove();
    });
    const restartGameBtn = document.querySelector('.recommencer-btn');
    restartGameBtn.addEventListener('click', () => {
        popup.remove();
        window.location.reload();
    });
}

function moveUpElement() {
    //console.log("up");
    let etatMove = true; //if any cell move, true for check again 
    let nbrMoves = 0;
    let nbrWhile = 0;
    while (etatMove) {
        let check = 0;
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                const cell = findCell(x, y);
                if (cell.getValue() != 0) {
                    const cellTemp = findCell(cell.getPosX(), cell.getPosY() - 1);
                    if (cellTemp) {
                        if (cellTemp.getValue() == 0) {
                            cellTemp.setValue(cell.getValue());
                            cell.setValue(0);
                            check += 1;
                            nbrMoves += 1;
                        } else if (cell.getValue() == cellTemp.getValue()) {
                            let newVal = cellTemp.getValue() + cell.getValue();
                            cellTemp.setValue(newVal);
                            //console.log("FUSION " + newVal);
                            cell.setValue(0);
                        }
                    }
                }
            }
        }
        if (check == 0) {
            etatMove = false;
        }
        nbrWhile += 1;
    }
    //consolePrintGame();
    //console.log("nbr move:" + nbrMoves + " nbrWhile:" + nbrWhile);

    setRandomCell(1);
}

function moveLeftElement() {
    //console.log("left");
    let etatMove = true; //if any cell move, true for check again 
    let nbrMoves = 0;
    let nbrWhile = 0;
    while (etatMove) {
        let check = 0;
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                const cell = findCell(x, y);
                if (cell.getValue() != 0) {
                    const cellTemp = findCell(cell.getPosX() - 1, cell.getPosY());
                    if (cellTemp) {
                        if (cellTemp.getValue() == 0) {
                            cellTemp.setValue(cell.getValue());
                            cell.setValue(0);
                            check += 1;
                            nbrMoves += 1;
                        } else if (cell.getValue() == cellTemp.getValue()) {
                            let newVal = cellTemp.getValue() + cell.getValue();
                            cellTemp.setValue(newVal);
                            //console.log("FUSION " + newVal);
                            cell.setValue(0);
                        }
                    }
                }
            }
        }
        if (check == 0) {
            etatMove = false;
        }
        nbrWhile += 1;
    }
    //consolePrintGame();
    //console.log("nbr move:" + nbrMoves + " nbrWhile:" + nbrWhile);

    setRandomCell(1);
}

function moveRightElement() {
    //console.log("right");
    let etatMove = true; //if any cell move, true for check again 
    let nbrMoves = 0;
    let nbrWhile = 0;
    while (etatMove) {
        let check = 0;
        for (let x = 3; x >= 0; x--) {
            for (let y = 0; y < 4; y++) {
                const cell = findCell(x, y);
                if (cell.getValue() != 0) {
                    const cellTemp = findCell(cell.getPosX() + 1, cell.getPosY());
                    if (cellTemp) {
                        if (cellTemp.getValue() == 0) {
                            cellTemp.setValue(cell.getValue());
                            cell.setValue(0);
                            check += 1;
                            nbrMoves += 1;
                        } else if (cell.getValue() == cellTemp.getValue()) {
                            let newVal = cellTemp.getValue() + cell.getValue();
                            cellTemp.setValue(newVal);
                            //console.log("FUSION " + newVal);
                            cell.setValue(0);
                        }
                    }
                }
            }
        }
        if (check == 0) {
            etatMove = false;
        }
        nbrWhile += 1;
    }
    //consolePrintGame();
    //console.log("nbr move:" + nbrMoves + " nbrWhile:" + nbrWhile);

    setRandomCell(1);
}

function moveDownElement() {
    //console.log("down");
    let etatMove = true; //if any cell move, true for check again 
    let nbrMoves = 0;
    let nbrWhile = 0;
    while (etatMove) {
        let check = 0;
        for (let y = 3; y >= 0; y--) {
            for (let x = 0; x < 4; x++) {
                const cell = findCell(x, y);
                if (cell.getValue() != 0) {
                    const cellTemp = findCell(cell.getPosX(), cell.getPosY() + 1);
                    if (cellTemp) {
                        if (cellTemp.getValue() == 0) {
                            cellTemp.setValue(cell.getValue());
                            cell.setValue(0);
                            check += 1;
                            nbrMoves += 1;
                        } else if (cell.getValue() == cellTemp.getValue()) {
                            let newVal = cellTemp.getValue() + cell.getValue();
                            cellTemp.setValue(newVal);
                            //console.log("FUSION " + newVal);
                            cell.setValue(0);
                        }
                    }
                }
            }
        }
        if (check == 0) {
            etatMove = false;
        }
        nbrWhile += 1;
    }
    //consolePrintGame();
    //console.log("nbr move:" + nbrMoves + " nbrWhile:" + nbrWhile);

    setRandomCell(1);
}

startGame();

/*
let x = 0, y = 0;
for (let i = 2; i < 2 ** 20; i *= 2) {
    const cell = findCell(x, y);
    if (cell) {
        cell.setValue(i);
    }
    x++;
    if (x===4){
        x=0;
        y++;
    }
}
*/
