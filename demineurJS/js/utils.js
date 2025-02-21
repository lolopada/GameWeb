const Utils = {
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getNeighbors(row, col, maxRow, maxCol) {
        const neighbors = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < maxRow && newCol >= 0 && newCol < maxCol) {
                    neighbors.push([newRow, newCol]);
                }
            }
        }
        return neighbors;
    }
};