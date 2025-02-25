let score = 0;
const pointsPerBlock = 10;

// Update the score display
function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('score-display');
    if (scoreDisplay) {
        scoreDisplay.textContent = score;
    }
}

// Add points based on number of blocks in a form
function addScore(blockCount) {
    score += blockCount * pointsPerBlock;
    updateScoreDisplay();
}

updateScoreDisplay();
