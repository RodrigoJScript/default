class StructureTower {
    static run(tower) {
        if (!tower) {
            return;
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile && tower.pos.inRangeTo(closestHostile, 20)) {
            tower.attack(closestHostile);
        } else {
            if (Game.time % 50 >= 40) {
                var damagedStructures = tower.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            (structure.structureType == STRUCTURE_RAMPART) &&
                            structure.hits < structure.hitsMax
                        );
                    }
                });

                damagedStructures.sort((a, b) => a.hits - b.hits);

                if (damagedStructures.length > 0) {
                    var currentIndex = Game.time % damagedStructures.length;
                    tower.repair(damagedStructures[currentIndex]);
                }
            } else {
                var otherDamagedStructures = tower.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            (structure.structureType == STRUCTURE_ROAD ||
                                structure.structureType == STRUCTURE_CONTAINER /*||
                    structure.structureType == STRUCTURE_RAMPART*/) &&
                            structure.hits < structure.hitsMax
                        );
                    }
                });

                if (otherDamagedStructures.length > 0) {
                    otherDamagedStructures.sort((a, b) => a.hits - b.hits);
                    tower.repair(otherDamagedStructures[0]);
                }
            }
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