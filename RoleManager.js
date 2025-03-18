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
            const centralLink = this.getCentralLink(this.creep.room);
            if (centralLink && this.creep.withdraw(centralLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.enhancedMoveTo(centralLink);
            }
        }
    }

    getCentralLink(room) {
        const spawn = room.find(FIND_MY_SPAWNS)[0];
        const links = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_LINK }
        });

        let centralLink = null;
        let minDistance = Infinity;

        for (const link of links) {
            const distance = spawn.pos.getRangeTo(link);
            if (distance < minDistance) {
                minDistance = distance;
                centralLink = link;
            }
        }

        return centralLink;
    }
}

module.exports = RoleManager;