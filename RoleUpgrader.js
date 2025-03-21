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
            // Moverse y mejorar el controlador
            if (this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE) {
                this.enhancedMoveTo(this.creep.room.controller);
            }
        } else {
            // Priorizar el linkUpgrade para extraer energía
            let source = Game.getObjectById(Memory.linkUpgrade);

            // Si no hay energía en el linkUpgrade, buscar en almacenamiento o contenedores
            if (!source || source.store[RESOURCE_ENERGY] == 0) {
                source = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.store[RESOURCE_ENERGY] > 0;
                    }
                });
            }

            // Si no hay almacenamiento o contenedores con energía, buscar una fuente de energía natural
            if (!source) {
                source = this.creep.pos.findClosestByPath(FIND_SOURCES);
            }

            // Intentar extraer energía del source encontrado
            if (source) {
                if (source.structureType === STRUCTURE_LINK || source.structureType === STRUCTURE_STORAGE || source.structureType === STRUCTURE_CONTAINER) {
                    if (this.creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.enhancedMoveTo(source);
                    }
                } else if (this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    this.enhancedMoveTo(source);
                }
            }
        }
    }
}

module.exports = RoleUpgrader;