const CreepRole = require("./CreepRole");

class RoleWallFortifier extends CreepRole {
    constructor(creep) {
        super(creep);
    }

    run() {
        if (this.creep.memory.working && this.creep.store[RESOURCE_ENERGY] == 0) {
            this.creep.memory.working = false;
        }
        if (!this.creep.memory.working && this.creep.store.getFreeCapacity() == 0) {
            this.creep.memory.working = true;
        }

        if (this.creep.memory.working) {
            const target = this.findLowestHitWallOrRampart();
            if (target) {
                if (this.creep.repair(target) == ERR_NOT_IN_RANGE) {
                    this.enhancedMoveTo(target);
                }
            }
        } else {
            let source = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_STORAGE || structure.structureType === STRUCTURE_CONTAINER &&
                        Memory.containersCouriers.includes(structure.id) &&
                        structure.store[RESOURCE_ENERGY] > 0;
                }
            });

            if (!source) {
                source = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store[RESOURCE_ENERGY] > 0;
                    }
                });
            }

            if (!source) {
                source = this.creep.pos.findClosestByPath(FIND_SOURCES);
            }

            if (source && (this.creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE || this.creep.harvest(source) == ERR_NOT_IN_RANGE)) {
                this.enhancedMoveTo(source);
            }
        }
    }

    findLowestHitWallOrRampart() {
        const targets = this.creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) &&
                    structure.hits < structure.hitsMax;
            }
        });

        if (targets.length > 0) {
            targets.sort((a, b) => a.hits - b.hits);
            return targets[0];
        }

        return null;
    }
}

module.exports = RoleWallFortifier;