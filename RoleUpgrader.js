const CreepRole = require("./CreepRole");

class RoleUpgrader extends CreepRole {
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
            if (this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE) {
                this.enhancedMoveTo(this.creep.room.controller);
            }
        } else {
            let source = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                        structure.store[RESOURCE_ENERGY] > 0;
                }
            });

            if (!source) {
                source = this.creep.pos.findClosestByPath(FIND_SOURCES);
            }

            if (source && (this.creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE || this.creep.harvest(source) == ERR_NOT_IN_RANGE)) {
                this.enhancedMoveTo(source);
            }
        }
    }
}

module.exports = RoleUpgrader;