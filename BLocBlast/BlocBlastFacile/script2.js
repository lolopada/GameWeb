// Fonction pour obtenir les proprietees un element draagable
function getElementProperty(elementId) {
    const element = draggableElements.find(el => el.id === elementId);
    if (element) {
        return {
            property: element.property,
            color: element.color,
            value: element.value
        };
    }
    return null;
}

function printElementProperty(elementId) {
    const properties = getElementProperty(elementId);
    if (properties) {
        console.log('Forme:', properties.property);
        console.log('Couleur:', properties.color);
        console.log('Valeur:', properties.value);

        // Pour accéder aux coordonnées de la forme
        properties.property.forEach(coord => {
            console.log(`Coordonnée relative: [${coord[0]}, ${coord[1]}]`);
        });
    }
}

function checkContainerEmpty() {
    const container = document.querySelector('.container-items');
    // Vérifie si le container existe et s'il n'a pas d'enfants
    if (container && container.children.length === 0) {
        console.log('Tous les éléments ont été placés !');
        return true;
    }
    console.log(`Il reste ${container?.children.length || 0} éléments à placer`);
    return false;
}

function checkGameOver() {
    console.log('=== checkGameOver: starting debug ===');

    // Récupère les éléments draggable depuis le DOM
    const domDraggableElements = document.querySelectorAll('[draggable="true"]');
    
    // Vérifie s'il reste des éléments à placer
    for (let y = 0; y < gridConfig.rows; y++) {
        for (let x = 0; x < gridConfig.cols; x++) {
            if (!isCellOccupied(x, y)) {
                for (const domElement of domDraggableElements) {
                    const properties = getElementProperty(domElement.id);
                    const shapeOffsets = [[0, 0], ...properties.property];
                    let canPlace = true;
                    for (const offset of shapeOffsets) {
                        const newX = x + offset[0];
                        const newY = y + offset[1];
                        if (
                            newX < 0 || newX >= gridConfig.cols ||
                            newY < 0 || newY >= gridConfig.rows ||
                            isCellOccupied(newX, newY)
                        ) {
                            canPlace = false;
                            break;
                        }
                    }
                    if (canPlace) {
                        console.log(`Element ${domElement.id} can be placed at (${x}, ${y})`);
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

function showEndGamePopup() {
    const existingPopup = document.querySelector('.popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h2>Partie terminée !</h2>
            <p>Votre score est de : ${score}</p>
            <button id="btnReplay">Rejouer</button>
        </div>
    `;
    document.body.appendChild(popup);

    const btnReplay = document.getElementById('btnReplay');
    if (btnReplay) {
        btnReplay.addEventListener('click', () => {
            location.reload();
        });
    }
}

function clearFullLinesAndColumns() {
    const fullRows = [];
    const fullCols = [];

    // Vérifier chaque ligne
    for (let y = 0; y < gridConfig.rows; y++) {
        let isRowFull = true;
        for (let x = 0; x < gridConfig.cols; x++) {
            if (!isCellOccupied(x, y)) {
                isRowFull = false;
                break;
            }
        }
        if (isRowFull) {
            fullRows.push(y);
        }
    }

    // Vérifier chaque colonne
    for (let x = 0; x < gridConfig.cols; x++) {
        let isColFull = true;
        for (let y = 0; y < gridConfig.rows; y++) {
            if (!isCellOccupied(x, y)) {
                isColFull = false;
                break;
            }
        }
        if (isColFull) {
            fullCols.push(x);
        }
    }

    // Vider les cellules des lignes complètes et ajouter 10 de score pour chaque cellule vidée
    fullRows.forEach(y => {
        for (let x = 0; x < gridConfig.cols; x++) {
            const cell = getCellAt(x, y);
            if (cell && isCellOccupied(x, y)) {
                cell.setOccupied(false);
                cell.element.innerHTML = '';
                score += 10;
                updateScoreDisplay();
            }
        }
    });

    // Vider les cellules des colonnes complètes en s'assurant de ne pas recompter
    fullCols.forEach(x => {
        for (let y = 0; y < gridConfig.rows; y++) {
            const cell = getCellAt(x, y);
            if (cell && isCellOccupied(x, y)) {
                cell.setOccupied(false);
                cell.element.innerHTML = '';
                score += 10;
                updateScoreDisplay();
            }
        }
    });
    
    console.log("Lignes complètes vidées :", fullRows);
    console.log("Colonnes complètes vidées :", fullCols);
}


/* EXEMPLE (A SUPP)
const elementId = 'draggable'; // ou draggable2, draggable3, draggable4
const properties = getElementProperty(elementId);

if (properties) {
    console.log('Forme:', properties.property);
    console.log('Couleur:', properties.color);
    console.log('Valeur:', properties.value);
    
    // Pour accéder aux coordonnées de la forme
    properties.property.forEach(coord => {
        console.log(`Coordonnée relative: [${coord[0]}, ${coord[1]}]`);
    });
}
*/
