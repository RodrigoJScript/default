class StructureTower {
    static run(tower) {
        if (!tower) {
            return;
        }

        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
            return;
        }
    }

    static runAll() {
        const towers = _.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_TOWER);
        for (const tower of towers) {
            this.run(tower);
        }
    }
}

module.exports = StructureTower;