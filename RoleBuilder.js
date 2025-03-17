const CreepRole = require("./CreepRole");

class RoleBuilder extends CreepRole {
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
            const target = this.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (target) {
                if (this.creep.build(target) == ERR_NOT_IN_RANGE) {
                    this.enhancedMoveTo(target);
                }
            } else {
                const damagedStructure = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                });
                if (damagedStructure) {
                    if (this.creep.repair(damagedStructure) == ERR_NOT_IN_RANGE) {
                        this.enhancedMoveTo(damagedStructure);
                    }
                }
            }
        } else {
            // Find the closest storage with energy
            let source = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_STORAGE &&
                        structure.store[RESOURCE_ENERGY] > 0;
                }
            });

            // If no storage has energy, find the closest container with energy
            if (!source) {
                source = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store[RESOURCE_ENERGY] > 0;
                    }
                });
            }

            // If no containers have energy, find the closest energy source
            if (!source) {
                source = this.creep.pos.findClosestByPath(FIND_SOURCES);
            }

            if (source && (this.creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE || this.creep.harvest(source) == ERR_NOT_IN_RANGE)) {
                this.enhancedMoveTo(source);
            }
        }
    }
}

module.exports = RoleBuilder;