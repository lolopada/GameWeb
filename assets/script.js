const regleDemineur = "Le but est de révéler toutes les cases vides d’une grille sans cliquer sur une mine. Les chiffres affichés sur certaines cases indiquent combien de mines se trouvent dans les cases adjacentes, aidant ainsi à les éviter.";
const regle2048 = "Fait glisser les tuiles numérotées dans une grille pour les fusionner lorsqu’elles ont la même valeur, doublant ainsi leur chiffre. L’objectif est d’atteindre la tuile 2048 avant que la grille ne soit complètement bloquée.";
const regleMemory = "Un ensemble de cartes face cachée est disposé à l'écran et ton but est de retourner deux cartes à la fois pour former des paires identiques. Le jeu continue jusqu’à ce que toutes les paires soient trouvées.";
const regleBlocus = "Blocus est un jeu de stratégie pour deux joueurs. Le but du jeu est de bloquer l'adversaire en condamnant des cases, jusqu'à ce qu'il ne puisse plus déplacer son pion."


// Fonction pour afficher le popup des règles
function showRulesPopup(title, rules) {
    // Supprime tout popup existant
    const existingPopup = document.querySelector('.popup');
    if (existingPopup) existingPopup.remove();

    // Crée le nouveau popup
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h2>${title}</h2>
            <p>${rules}</p>
            <button id="close-rules" class="close-button">Fermer</button>
        </div>
    `;
    document.body.appendChild(popup);

    // Ajoute l'événement pour fermer le popup
    const closeButton = document.getElementById('close-rules');
    closeButton.addEventListener('click', () => {
        popup.remove();
    });
}

// Ajoute les événements aux boutons de règles
document.addEventListener('DOMContentLoaded', () => {
    const rulesButtons = document.querySelectorAll('.rules-button');
    
    rulesButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            switch(index) {
                case 0:
                    showRulesPopup('Règles du Blocus', regleBlocus);
                    break;
                case 1:
                    showRulesPopup('Règles du Démineur', regleDemineur);
                    break;
                case 2:
                    showRulesPopup('Règles du Memory', regleMemory);
                    break;
                case 3:
                    showRulesPopup('Règles du 2048', regle2048);
                    break;
            }
        });
    });
});