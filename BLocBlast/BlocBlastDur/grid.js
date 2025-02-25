class Cell {
    constructor(x, y, element) {
        this.x = x;
        this.y = y;
        this.occupied = false; // Changed from value to occupied boolean
        this.element = element;
    }

    toString() {
        return (this.occupied ? "1" : "0") + "   " + this.getPos();
    }

    isOccupied() {
        return this.occupied;
    }

    getPos() {
        return this.x + "," + this.y;
    }

    getPosX() {
        return this.x;
    }

    getPosY() {
        return this.y;
    }

    setOccupied(isOccupied) {
        this.element.classList.remove(this.occupied ? 'occupied' : 'empty');
        this.occupied = isOccupied;
        this.element.classList.add(isOccupied ? 'occupied' : 'empty');
    }
}

const gridConfig = {
    rows: 8,
    cols: 8
};

// Tableau pour stocker les instances de Cell
const cellsArray = [];

// Modifier la fonction initCells pour rendre la taille des cellules responsive
function initCells() {
    const grid = document.querySelector('.grid');
    const isMobile = window.innerWidth <= 768;
    const cellSize = isMobile ? '45px' : '60px';

    grid.style.gridTemplateColumns = `repeat(${gridConfig.cols}, ${cellSize})`;

    for (let y = 0; y < gridConfig.rows; y++) {
        cellsArray[y] = [];
        for (let x = 0; x < gridConfig.cols; x++) {
            const element = document.createElement('div');
            element.className = 'cell';
            element.dataset.x = x;
            element.dataset.y = y;
            element.dataset.index = y * gridConfig.cols + x;

            const cell = new Cell(x, y, element);
            cellsArray[y][x] = cell;
            grid.appendChild(element);
        }
    }
}

// Ajouter un écouteur pour redimensionner la grille si nécessaire
window.addEventListener('resize', () => {
    const grid = document.querySelector('.grid');
    const isMobile = window.innerWidth <= 768;
    const cellSize = isMobile ? '45px' : '60px';

    grid.style.gridTemplateColumns = `repeat(${gridConfig.cols}, ${cellSize})`;
});

// Fonction utilitaire pour obtenir une cellule par ses coordonnées
function getCellAt(x, y) {
    if (y >= 0 && y < gridConfig.rows && x >= 0 && x < gridConfig.cols) {
        return cellsArray[y][x];
    }
    return null;
}

// vérifier si une cellule est occupée
function isCellOccupied(x, y) {
    const cell = getCellAt(x, y);
    return cell ? cell.isOccupied() : true;
}

// Modifier la fonction occupyCell
function occupyCell(x, y, value) {
    const cell = getCellAt(x, y);
    if (cell) {
        cell.setOccupied(value);
    }
}

function logGridState() {
    console.group('État actuel de la grille :');
    for (let y = 0; y < gridConfig.rows; y++) {
        let row = `%c[${y}] `; // Ajout de l'identifiant de ligne
        let styles = ['color: #ff9800; font-weight: bold']; // Style pour l'ID de ligne

        for (let x = 0; x < gridConfig.cols; x++) {
            const cell = cellsArray[y][x];
            const isOcc = cell.isOccupied();
            row += isOcc ? '%c true ' : '%c false ';
            styles.push(cellsArray[y][x].isOccupied() ? 'color: #2ecc71; font-weight: bold' : 'color: gray');
        }

        console.log(row, ...styles);
    }
    console.groupEnd();
}

initCells();


//for container-items responsive
const isMobile = window.innerWidth <= 768;
const containert = document.querySelector('.container-items');
containert.style.marginTop = isMobile ? '-70px' : '-70px';
