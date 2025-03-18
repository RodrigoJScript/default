const CreepRole = require("./CreepRole");

class RoleCourier extends CreepRole {
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
            const container = Game.getObjectById(this.creep.memory.containerId);
            if (container && container.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                if (this.creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.enhancedMoveTo(container);
                }
            } else {
                console.log(`Creep ${this.creep.name} no encontró un contenedor válido o está lleno.`);
            }
        } else {
            const storage = this.creep.room.storage;
            if (storage && storage.store[RESOURCE_ENERGY] > 0) {
                if (this.creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.enhancedMoveTo(storage);
                }
            } else {
                console.log(`Creep ${this.creep.name} no encontró un storage con energía.`);
            }
        }
    }
}

module.exports = RoleCourier;