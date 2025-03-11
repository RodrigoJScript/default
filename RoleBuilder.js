const CreepRole = require("./CreepRole");

const PATH_STYLE_BUILD = { stroke: '#ffffff' };
const PATH_STYLE_HARVEST = { stroke: '#ffaa00' };

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
            if (target && this.creep.build(target) == ERR_NOT_IN_RANGE) {
                this.enhancedMoveTo(target, { visualizePathStyle: PATH_STYLE_BUILD });
            }
        } else {
            const source = this.creep.pos.findClosestByPath(FIND_SOURCES);
            if (source && this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
                this.enhancedMoveTo(source, { visualizePathStyle: PATH_STYLE_HARVEST });
            }
        }
    }
}

module.exports = RoleBuilder;