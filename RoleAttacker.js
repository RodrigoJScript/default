const CreepRole = require("./CreepRole");

class RoleAttacker extends CreepRole {
    constructor(creep) {
        super(creep);
    }

    run() {
        const attackFlag = Game.flags.attack;

        if (!attackFlag) {
            console.log(`Creep ${this.creep.name} no encontró la bandera 'attack'.`);
            return;
        }

        // Si el creep no está en la sala de la bandera, moverse hacia ella
        if (this.creep.room.name !== attackFlag.pos.roomName) {
            this.creep.moveTo(attackFlag, {
                visualizePathStyle: { stroke: '#ff0000' },
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

        // Si ya está en la sala de la bandera, buscar el spawn enemigo
        const enemySpawn = this.creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
        if (enemySpawn) {
            if (this.creep.attack(enemySpawn) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(enemySpawn, { visualizePathStyle: { stroke: '#ff0000' } });
            }
            return;
        }

        // Si no hay spawn, buscar muros que bloqueen el camino
        const blockingWall = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_WALL
        });

        if (blockingWall) {
            if (this.creep.attack(blockingWall) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(blockingWall, { visualizePathStyle: { stroke: '#ff0000' } });
            }
            return;
        }

        // Si no hay spawn ni muros, atacar creeps enemigos
        const hostileCreep = this.creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (hostileCreep) {
            if (this.creep.attack(hostileCreep) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(hostileCreep, { visualizePathStyle: { stroke: '#ff0000' } });
            }
            return;
        }

        console.log(`Creep ${this.creep.name} no encontró objetivos en la sala.`);
    }
}

module.exports = RoleAttacker;