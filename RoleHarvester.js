const CreepRole = require("./CreepRole");

const PATH_STYLE_TRANSFER = { stroke: '#ffffff' };
const PATH_STYLE_HARVEST = { stroke: '#ffaa00' };

class RoleHarvester extends CreepRole {
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
                    return (structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (target && this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.enhancedMoveTo(target, { visualizePathStyle: PATH_STYLE_TRANSFER });
            }
        } else {
            const source = Game.getObjectById(this.creep.memory.sourceId);
            if (source && this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
                this.enhancedMoveTo(source, { visualizePathStyle: PATH_STYLE_HARVEST });
            }
        }
    }
}

module.exports = RoleHarvester;