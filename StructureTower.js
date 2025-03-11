module.exports = {
    run: function (tower) {
        if (!tower) {
            return;
        }

        // Prioritize attacking hostile creeps
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
            return;
        }
    }
};