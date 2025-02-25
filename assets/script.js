const gameRules = [
    {
        title: "Règles du Blocus",
        rules: "Blocus est un jeu de stratégie pour deux joueurs. Le but du jeu est de bloquer l'adversaire en condamnant des cases, jusqu'à ce qu'il ne puisse plus déplacer son pion."
    },
    {
        title: "Règles du Démineur",
        rules: "Le but est de révéler toutes les cases vides d’une grille sans cliquer sur une mine. Les chiffres affichés indiquent combien de mines se trouvent autour."
    },
    {
        title: "Règles du Memory",
        rules: "Retournez deux cartes à la fois pour former des paires identiques. Le jeu se termine lorsque toutes les paires sont trouvées."
    },
    {
        title: "Règles du 2048",
        rules: "Fait glisser les tuiles numérotées dans une grille pour les fusionner. L’objectif est d’atteindre la tuile 2048 avant que la grille ne soit bloquée."
    },
    {
        title: "Règles du 2048 - Algorithmes",
        rules: "Explorez divers algorithmes qui tentent de résoudre le jeu 2048 automatiquement. Chaque algorithme simule les coups possibles pour choisir le meilleur mouvement en fonction d'une fonction d'évaluation."
    },
    {
        title: "Règles du Bloc Blast",
        rules: "Éliminez un maximum de blocs colorés en remplissant des lignes et des colonnes complètes. Dès qu'une rangée ou une colonne est entièrement remplie, elle disparaît, libérant de l'espace pour de nouveaux placements !"
    }
];

function showRulesPopup({ title, rules }) {
    // Supprime un éventuel popup existant
    const existingPopup = document.querySelector('.popup');
    if (existingPopup) existingPopup.remove();

    // Crée et affiche le popup
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h2>${title}</h2>
            <p>${rules}</p>
            <button class="close-button">Fermer</button>
        </div>
    `;
    document.body.appendChild(popup);

    // Ajoute l'événement de fermeture
    popup.querySelector('.close-button').addEventListener('click', () => popup.remove());
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.rules-button').forEach((button, index) => {
        button.addEventListener('click', () => {
            const game = gameRules[index];
            if (game) 
                showRulesPopup(game);
        });
    });
});