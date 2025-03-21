const CreepRole = require("./CreepRole");

class RoleRangedAttacker extends CreepRole {
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
            });
            return;
        }

        // Obtener el objetivo compartido en la memoria global
        if (!Memory.sharedTarget || !Game.getObjectById(Memory.sharedTarget)) {
            // Si no hay un objetivo compartido o el objetivo ya no existe, buscar uno nuevo
            const newTarget = this.creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if (newTarget) {
                Memory.sharedTarget = newTarget.id; // Guardar el nuevo objetivo en la memoria global
            }
        }

        const target = Game.getObjectById(Memory.sharedTarget);

        // Buscar todos los creeps enemigos cercanos
        const hostileCreeps = this.creep.room.find(FIND_HOSTILE_CREEPS);
        const closeEnemies = hostileCreeps.filter((hostile) => this.creep.pos.getRangeTo(hostile) <= 3);

        // Si hay enemigos cercanos, atacar antes de huir
        if (closeEnemies.length > 0) {
            if (target && this.creep.rangedAttack(target) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
            }

            // Huir de los enemigos cercanos
            const fleePath = PathFinder.search(this.creep.pos, closeEnemies.map((hostile) => ({ pos: hostile.pos, range: 5 })), { flee: true });
            this.creep.moveByPath(fleePath.path);
            return;
        }

        // Si no hay enemigos cercanos, atacar al objetivo compartido
        if (target) {
            if (this.creep.rangedAttack(target) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
            }
            return;
        }

        // Si no hay creeps enemigos, buscar estructuras hostiles
        const hostileStructure = this.creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
        if (hostileStructure) {
            if (this.creep.rangedAttack(hostileStructure) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(hostileStructure, { visualizePathStyle: { stroke: '#ff0000' } });
            }
            return;
        }

        console.log(`Creep ${this.creep.name} no encontró objetivos en la sala.`);
    }
}

module.exports = RoleRangedAttacker;