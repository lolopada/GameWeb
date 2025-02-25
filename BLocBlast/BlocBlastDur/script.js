// Événements de base pour le drag and drop sur PC
// 1. handleDragStart(e) - Démarre le glisser
// 2. 'dragover' event - Gère le survol
// 3. 'dragleave' event - Gère la sortie du survol
// 4. 'drop' event - Gère le dépôt
// 5. 'dragend' event - Gère la fin du glisser

// Fonctions pour Mobile (Touch Events)
// 1. handleTouchStart(e) - Démarre le touch
// 2. handleTouchMove(e) - Gère le déplacement du doigt
// 3. handleTouchEnd(e) - Gère la fin du touch
// 4. Gestion du ghostElement - Clone visuel qui suit le doigt

// Fonctions utilitaires utilisées par les deux systèmes
// 1. getValueFromElement(elementId) - Obtient la valeur de l'élément
// 2. isCellOccupied(x, y) - Vérifie si une cellule est occupée
// 3. occupyCell(x, y, value) - Marque une cellule comme occupée
// 4. logGridState() - Log l'état de la grille
// 5. getCellAt(x, y) - obtenir une cellule par ses coordonnées
// 6. addEventListenersToDraggables() - ajoute écouteurs d'événements 
// 7. handleEvent(e) - affiche les écouteurs d'évènements en console pour debugging
// 8. checkContainerEmpty() - verifie si le container pour les items est empty et mettre de nouveaux form


function generateRandomDraggableElements() {
    const ELEMENTS_COUNT = 3;
    const forms = [
        form_A_1, form_A_2, form_A_3, form_A_4,
        form_B,
        form_C_1, form_C_2, form_C_3, form_C_4,
        form_D_1, form_D_2,
        form_E,
        form_F_1, form_F_2,
        form_G_1, form_G_2, form_G_3, form_G_4,
        form_H_1, form_H_2, form_H_3, form_H_4, form_H_5, form_H_6, form_H_7, form_H_8,
        form_I_1, form_I_2, form_I_3, form_I_4,
        form_J_1, form_J_2, form_J_3, form_J_4,
        form_K,
        form_L_1, form_L_2, form_L_3, form_L_4
    ];
    let availableColors = [
        '#FF3333', // Slightly less bright Red
        '#33FFD1', // Slightly less bright Turquoise
        '#3399FF', // Slightly less bright Blue
        '#33FF66', // Slightly less bright Green
        '#FFFF33', // Slightly less bright Yellow
        '#FF66CC', // Slightly less bright Pink
        '#9933FF'  // Slightly less bright Purple
    ];

    function getRandomArrayElement(array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        // Retourner l'élément et le supprimer du tableau
        return array.splice(randomIndex, 1)[0];
    }

    const draggableElements = [];

    for (let i = 0; i < ELEMENTS_COUNT; i++) {
        const element = {
            id: `draggable${i + 1}`,
            color: getRandomArrayElement(availableColors), // Chaque couleur ne sera utilisée qu'une fois
            value: i + 1,
            property: getRandomArrayElement(forms)
        };
        draggableElements.push(element);
    }

    return draggableElements;
}

let draggableElements = generateRandomDraggableElements();

function printFormElement(container, color, property) {
    const isMobile = window.innerWidth <= 768;
    const cellSize = isMobile ? 25 : 50;
    const gap = 10;

    // Calculer le box-shadow pour chaque offset de la forme
    const shadows = property.map(offset => {
        const x = offset[0] * (cellSize + gap);
        const y = offset[1] * (cellSize + gap);
        return `${x}px ${y}px 0 0 ${color}`;
    }).join(', ');

    // Appliquer le box-shadow au container principal
    container.style.boxShadow = shadows;
    container.style.width = cellSize + 'px';
    container.style.height = cellSize + 'px';
    container.style.backgroundColor = color;
    container.style.position = 'relative';

    // Ajouter le rond jaune au centre
    const grabIndicator = document.createElement('div');
    grabIndicator.style.position = 'absolute';
    grabIndicator.style.width = `${cellSize * 0.3}px`;  // 30% de la taille de la cellule
    grabIndicator.style.height = `${cellSize * 0.3}px`; // 30% de la taille de la cellule
    grabIndicator.style.backgroundColor = '#ccc';
    grabIndicator.style.borderRadius = '50%';           // Pour faire un cercle
    grabIndicator.style.left = '50%';
    grabIndicator.style.top = '50%';
    grabIndicator.style.transform = 'translate(-50%, -50%)';
    grabIndicator.style.pointerEvents = 'none';

    // Ajouter les éléments au container
    container.appendChild(grabIndicator);

    // Calculate proper bottom margin based on form shape
    if (isMobile) {
        let maxY = 0;
        // Check all points including the base point (0,0)
        [[0, 0], ...property].forEach(offset => {
            maxY = Math.max(maxY, offset[1]);
        });
        // Add extra margin for better spacing
        container.style.marginBottom = `${(maxY + 2) * cellSize}px`;
    } else {
        container.style.margin = `${(cellSize + gap) * 2}px`;
    }
}

function createDraggableElements() {
    const container = document.querySelector('.container-items');

    draggableElements.forEach(element => {
        const draggableDiv = document.createElement('div');
        draggableDiv.id = element.id;
        draggableDiv.draggable = true;
        draggableDiv.style.cursor = 'move';
        draggableDiv.style.zIndex = '1000';

        // Dessiner la form de l'element 
        printFormElement(draggableDiv, element.color, element.property);

        container.appendChild(draggableDiv);
    });
}

createDraggableElements();



const cells = document.querySelectorAll('.cell');

let touchTimeout;
let isDragging = false;
let currentDragElement = null;
let ghostElement = null;


// Gestionnaire de drag start
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {
        e.target.style.opacity = '0.5';
    }, 0);

    // Réinitialiser l'état de l'ancienne cellule
    const parentCell = e.target.parentElement;
    if (parentCell.classList.contains('cell')) {
        const x = parseInt(parentCell.dataset.x);
        const y = parseInt(parentCell.dataset.y);
        occupyCell(x, y, false);
    }
}

// Fonction pour gérer le début du touch
function handleTouchStart(e) {
    const element = e.target;
    touchTimeout = setTimeout(() => {
        isDragging = true;
        currentDragElement = element;
        element.style.opacity = '0.5';

        // Créer l'élément fantôme
        ghostElement = element.cloneNode(true);
        ghostElement.style.position = 'fixed';
        ghostElement.style.pointerEvents = 'none';
        ghostElement.style.opacity = '0.6';
        ghostElement.style.zIndex = '1000';
        document.body.appendChild(ghostElement);

        // Positionner l'élément fantôme
        const touch = e.touches[0];
        ghostElement.style.left = (touch.clientX - element.offsetWidth / 2) + 'px';
        ghostElement.style.top = (touch.clientY - element.offsetHeight / 2) + 'px';

        // Réinitialiser l'état de l'ancienne cellule
        const parentCell = element.parentElement;
        if (parentCell.classList.contains('cell')) {
            const x = parseInt(parentCell.dataset.x);
            const y = parseInt(parentCell.dataset.y);
            occupyCell(x, y, false);
        }
    }, 100); // Temps réduit pour un déclenchement plus rapide
}

// Fonction pour gérer le mouvement du touch
function handleTouchMove(e) {
    if (isDragging && currentDragElement) {
        e.preventDefault(); // Empêche le scroll
        const touch = e.touches[0];
        const elements = document.elementsFromPoint(touch.clientX, touch.clientY);

        // Déplacer l'élément fantôme
        if (ghostElement) {
            ghostElement.style.left = (touch.clientX - currentDragElement.offsetWidth / 2) + 'px';
            ghostElement.style.top = (touch.clientY - currentDragElement.offsetHeight / 2) + 'px';
        }

        // Trouve la cellule sous le touch
        const cell = elements.find(el => el.classList.contains('cell'));

        // Gestion du hover visuel
        cells.forEach(c => c.classList.remove('hover'));
        if (cell) {
            cell.classList.add('hover');
        }
    }
}

// Fonction pour gérer la fin du touch
function handleTouchEnd(e) {
    clearTimeout(touchTimeout);

    if (isDragging && currentDragElement) {
        const touch = e.changedTouches[0];
        const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
        const cell = elements.find(el => el.classList.contains('cell'));

        if (cell) {
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);

            // Récupérer la configuration de l'élément et sa forme
            const elementConfig = draggableElements.find(el => el.id === currentDragElement.id);
            const properties = getElementProperty(currentDragElement.id);
            const shapeOffsets = [[0, 0], ...properties.property];

            // Vérifier si les cellules sont occupées
            let verifCellOccupied = false;
            shapeOffsets.forEach(offset => {
                if (isCellOccupied(x + offset[0], y + offset[1])) {
                    verifCellOccupied = true;
                }
            });

            if (!verifCellOccupied) {
                const color = elementConfig ? elementConfig.color : 'gray';
                // Placer l'élément sur toutes les cellules de la forme
                shapeOffsets.forEach(offset => {
                    const targetCell = getCellAt(x + offset[0], y + offset[1]);
                    if (targetCell) {
                        targetCell.element.innerHTML = `<div class="placed-element" style="background-color: ${color}"></div>`;
                        occupyCell(x + offset[0], y + offset[1], true);
                    }
                });

                currentDragElement.remove();
                logGridState();
                addScore(shapeOffsets.length);
                if (checkContainerEmpty()) {
                    draggableElements = generateRandomDraggableElements();
                    createDraggableElements();
                    // Attendre que les éléments soient créés avant d'ajouter les listeners
                    requestAnimationFrame(() => {
                        addEventListenersToDraggables();
                    });
                }
                if (checkGameOver()) {
                    showEndGamePopup();
                }
            }
        }

        currentDragElement.style.opacity = '1';
        cells.forEach(c => c.classList.remove('hover'));

        if (ghostElement) {
            ghostElement.remove();
            ghostElement = null;
        }
    }

    isDragging = false;
    currentDragElement = null;
}

cells.forEach(cell => {
    cell.addEventListener('dragover', (e) => {
        e.preventDefault();
        cell.classList.add('hover');
    });

    cell.addEventListener('dragleave', (e) => {
        cell.classList.remove('hover');
    });

    cell.addEventListener('drop', (e) => {
        e.preventDefault();
        cell.classList.remove('hover');

        const data = e.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(data);

        // Obtenir les coordonnées de la cellule
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        // Vérifier si les cellules sont pas déjà occupée
        const elementConfig = draggableElements.find(el => el.id === draggedElement.id);
        const properties = getElementProperty(draggedElement.id);
        // Inclure la cellule racine dans la forme
        const shapeOffsets = [[0, 0], ...properties.property];

        let verifCellOccupied = false;
        shapeOffsets.forEach(offset => {
            if (isCellOccupied(x + offset[0], y + offset[1])) {
                verifCellOccupied = true;
            }
        });

        if (!verifCellOccupied) {
            const color = elementConfig ? elementConfig.color : 'gray'; // 'gray' comme couleur par défaut
            shapeOffsets.forEach(offset => {
                const targetCell = getCellAt(x + offset[0], y + offset[1]);
                if (targetCell) {
                    targetCell.element.innerHTML = `<div class="placed-element" style="background-color: ${color}"></div>`;
                    occupyCell(x + offset[0], y + offset[1], true);
                }
            });
            draggedElement.remove();
            addScore(shapeOffsets.length);
            clearFullLinesAndColumns();
            logGridState();
            if (checkContainerEmpty()) {
                draggableElements = generateRandomDraggableElements();
                createDraggableElements();
                // Attendre que les éléments soient créés avant d'ajouter les listeners
                requestAnimationFrame(() => {
                    addEventListenersToDraggables();
                });
            }
            if (checkGameOver()) {
                showEndGamePopup();
            }
        }
    });
});

function addEventListenersToDraggables() {
    draggableElements.forEach(config => {
        const element = document.getElementById(config.id);
        if (element) {
            // Ajouter handleEvent comme callback pour suivre les événements
            element.addEventListener('touchstart', handleEvent);
            element.addEventListener('touchmove', handleEvent);
            element.addEventListener('touchend', handleEvent);
            element.addEventListener('dragstart', handleEvent);
            element.addEventListener('dragend', handleEvent);

            // Garder les gestionnaires existants // fluidité pour mobile
            element.addEventListener('touchstart', handleTouchStart, { passive: false });
            element.addEventListener('touchmove', handleTouchMove, { passive: false });
            element.addEventListener('touchend', handleTouchEnd);
            element.addEventListener('dragstart', handleDragStart);
            element.addEventListener('dragend', (e) => {
                e.target.style.opacity = '1';
            });
        }
    });
}

addEventListenersToDraggables();

function handleEvent(e) {
    console.log('Type d\'événement:', e.type);
    //console.log('Élément cible:', e.target);
    //console.log('Position souris/touch X:', e.clientX || e.touches[0].clientX);
    //console.log('Position souris/touch Y:', e.clientY || e.touches[0].clientY);
}

