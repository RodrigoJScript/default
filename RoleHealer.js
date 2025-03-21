const CreepRole = require("./CreepRole");

class RoleHealer extends CreepRole {
    constructor(creep) {
        super(creep);
    }

    run() {
        const attackFlag = Game.flags.attack;

        if (!attackFlag) {
            console.log(`Creep ${this.creep.name} no encontró la bandera 'attack'.`);
            return;
        }

        // Si el creep está siendo atacado (su vida está por debajo del máximo), curarse a sí mismo
        if (this.creep.hits < this.creep.hitsMax) {
            if (this.creep.heal(this.creep) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(this.creep, { visualizePathStyle: { stroke: '#00ff00' } });
            }
            return; // Priorizar curarse a sí mismo
        }

        // Si el creep no está en la sala de la bandera, moverse hacia ella
        if (this.creep.room.name !== attackFlag.pos.roomName) {
            this.creep.moveTo(attackFlag, {
                visualizePathStyle: { stroke: '#00ff00' },
                costCallback: (roomName, costMatrix) => {
                    const room = Game.rooms[roomName];
                    // Evitar salas con controladores de nivel > 3, excepto si es mi sala
                    if (room && room.controller) {
                        if (room.controller.my) {
                            return costMatrix; // Permitir mi propia sala
                        }
                        if (room.controller.level > 3) {
                            console.log(`Evitando sala ${roomName} con controlador de nivel ${room.controller.level}`);
                            return false; // Evitar esta sala
                        }
                    }
                    return costMatrix;
                }
            });
            return;
        }

        // Buscar el creep attacker en la sala
        const attacker = _.find(Game.creeps, (creep) => creep.memory.role === 'attacker' && creep.room.name === this.creep.room.name);

        if (!attacker) {
            console.log(`Creep ${this.creep.name} no encontró un attacker para seguir en la sala.`);
            return;
        }

        // Si el attacker necesita curación, curarlo
        if (attacker.hits < attacker.hitsMax) {
            if (this.creep.heal(attacker) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(attacker, { visualizePathStyle: { stroke: '#00ff00' } });
            }
        } else {
            // Si el attacker no necesita curación, seguirlo
            this.creep.moveTo(attacker, { visualizePathStyle: { stroke: '#00ff00' } });
        }
    }
}

module.exports = RoleHealer;