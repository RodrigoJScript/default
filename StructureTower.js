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

        // Repair the most damaged structure
        const damagedStructures = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });

        if (damagedStructures.length > 0) {
            damagedStructures.sort((a, b) => a.hits - b.hits);
            tower.repair(damagedStructures[0]);
        }
    }
};