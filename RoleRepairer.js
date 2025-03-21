const CreepRole = require("./CreepRole");

class RoleRepairer extends CreepRole {
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
            const target = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.hits < structure.hitsMax &&
                        structure.structureType !== STRUCTURE_WALL &&
                        structure.structureType !== STRUCTURE_RAMPART;
                }
            });

            if (target) {
                if (this.creep.repair(target) === ERR_NOT_IN_RANGE) {
                    this.enhancedMoveTo(target);
                }
            } else {
                console.log(`Creep ${this.creep.name} no encontró estructuras para reparar.`);
            }
        } else {
            let source = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        (structure.structureType === STRUCTURE_STORAGE ||
                            structure.structureType === STRUCTURE_CONTAINER) &&
                        structure.store[RESOURCE_ENERGY] > 0
                    );
                }
            });

            if (!source) {
                source = this.creep.pos.findClosestByPath(FIND_SOURCES);
            }

            if (source) {
                if (source.structureType === STRUCTURE_STORAGE || source.structureType === STRUCTURE_CONTAINER) {
                    if (this.creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.enhancedMoveTo(source);
                    }
                } else if (this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    this.enhancedMoveTo(source);
                }
            }
        }
    }
}

module.exports = RoleRepairer;