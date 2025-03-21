class StructureTower {
    static run(tower) {
        if (!tower) {
            return;
        }

        // Priorizar curar a creeps aliados
        const closestDamagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (creep) => creep.hits < creep.hitsMax
        });

        if (closestDamagedCreep) {
            tower.heal(closestDamagedCreep);
            return;
        }

        // Atacar creeps enemigos si no hay creeps aliados para curar
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
            return;
        }

        // Reparar estructuras dañadas
        if (Game.time % 50 >= 40) {
            const damagedStructures = tower.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_RAMPART &&
                        structure.hits < structure.hitsMax
                    );
                }
            });

            damagedStructures.sort((a, b) => a.hits - b.hits);

            if (damagedStructures.length > 0) {
                const currentIndex = Game.time % damagedStructures.length;
                tower.repair(damagedStructures[currentIndex]);
            }
        } else {
            const otherDamagedStructures = tower.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        (structure.structureType == STRUCTURE_ROAD ||
                            structure.structureType == STRUCTURE_CONTAINER) &&
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

    static runAll() {
        const towers = _.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_TOWER);
        for (const tower of towers) {
            this.run(tower);
        }
    }
}

module.exports = StructureTower;