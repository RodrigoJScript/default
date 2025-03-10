const CreepRole = require("./CreepRole");

class RoleUpgrader extends CreepRole {
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
            if (this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(this.creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
}

module.exports = RoleUpgrader;