const CreepRole = require("./CreepRole");

class RoleBuilder extends CreepRole {
    constructor(creep) {
        super(creep);
    }

    run() {
        if (this.creep.store[RESOURCE_ENERGY] == 0) {
            const source = this.creep.pos.findClosestByPath(FIND_SOURCES);
            if (source && this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            const target = this.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (target && this.creep.build(target) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
}

module.exports = RoleBuilder;