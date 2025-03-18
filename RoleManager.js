const CreepRole = require("./CreepRole");

class RoleManager extends CreepRole {
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
            const storage = this.creep.room.storage;
            if (storage && this.creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.enhancedMoveTo(storage);
            }
        } else {
            const link = Game.getObjectById(this.creep.memory.linkId);
            if (link && this.creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.enhancedMoveTo(link);
            }
        }
    }
}

module.exports = RoleManager;