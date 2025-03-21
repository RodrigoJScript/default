const CreepFactory = require('./CreepFactory');
const CreepManager = require('./CreepManager');

const ROLE_HARVESTER = 'harvester';
const ROLE_BUILDER = 'builder';
const ROLE_UPGRADER = 'upgrader';
const ROLE_HAULER = 'hauler';
const ROLE_SCAVENGER = 'scavenger';
const ROLE_WALL_FORTIFIER = 'wallFortifier';
const ROLE_MANAGER = 'manager';
const ROLE_SUPPLIER = 'supplier';
const ROLE_COURIER = 'courier';
const ROLE_REPAIRER = 'repairer';

const DESIRED_HARVESTERS = 2;
const DESIRED_BUILDERS = 1;
const DESIRED_UPGRADERS = 1;
const DESIRED_HAULERS = 0;
const DESIRED_SCAVENGERS = 1;
const DESIRED_WALL_FORTIFIERS = 0;
const DESIRED_MANAGERS = 1;
const DESIRED_SUPPLIERS = 1;
const DESIRED_COURIERS = 0;
const DESIRED_REPAIRERS = 0;

class SpawnManager {
    static run() {
        this.spawnCreepsIfNeeded();
        this.renewCreeps();
    }

    static spawnCreepsIfNeeded() {
        const currentHarvesters = CreepManager.getCreepCountByRole(ROLE_HARVESTER);
        const currentBuilders = CreepManager.getCreepCountByRole(ROLE_BUILDER);
        const currentUpgraders = CreepManager.getCreepCountByRole(ROLE_UPGRADER);
        const currentHaulers = CreepManager.getCreepCountByRole(ROLE_HAULER);
        const currentScavengers = CreepManager.getCreepCountByRole(ROLE_SCAVENGER);
        const currentWallFortifiers = CreepManager.getCreepCountByRole(ROLE_WALL_FORTIFIER);
        const currentManagers = CreepManager.getCreepCountByRole(ROLE_MANAGER);
        const currentSuppliers = CreepManager.getCreepCountByRole(ROLE_SUPPLIER);
        const currentCouriers = CreepManager.getCreepCountByRole(ROLE_COURIER);
        const currentRepairers = CreepManager.getCreepCountByRole(ROLE_REPAIRER);

        const spawn = this.getAvailableSpawn();

        if (spawn) {
            if (currentHarvesters < DESIRED_HARVESTERS) {
                console.log(`Spawning harvester. Current: ${currentHarvesters}, Desired: ${DESIRED_HARVESTERS}`);
                CreepFactory.createCreep(ROLE_HARVESTER, spawn);
            } else if (currentBuilders < DESIRED_BUILDERS) {
                console.log(`Spawning builder. Current: ${currentBuilders}, Desired: ${DESIRED_BUILDERS}`);
                CreepFactory.createCreep(ROLE_BUILDER, spawn);
            } else if (currentUpgraders < DESIRED_UPGRADERS) {
                console.log(`Spawning upgrader. Current: ${currentUpgraders}, Desired: ${DESIRED_UPGRADERS}`);
                CreepFactory.createCreep(ROLE_UPGRADER, spawn);
            } else if (currentHaulers < DESIRED_HAULERS) {
                console.log(`Spawning hauler. Current: ${currentHaulers}, Desired: ${DESIRED_HAULERS}`);
                CreepFactory.createCreep(ROLE_HAULER, spawn);
            } else if (currentScavengers < DESIRED_SCAVENGERS) {
                console.log(`Spawning scavenger. Current: ${currentScavengers}, Desired: ${DESIRED_SCAVENGERS}`);
                CreepFactory.createCreep(ROLE_SCAVENGER, spawn);
            } else if (currentWallFortifiers < DESIRED_WALL_FORTIFIERS) {
                console.log(`Spawning wallFortifier. Current: ${currentWallFortifiers}, Desired: ${DESIRED_WALL_FORTIFIERS}`);
                CreepFactory.createCreep(ROLE_WALL_FORTIFIER, spawn);
            } else if (currentManagers < DESIRED_MANAGERS) {
                console.log(`Spawning manager. Current: ${currentManagers}, Desired: ${DESIRED_MANAGERS}`);
                CreepFactory.createCreep(ROLE_MANAGER, spawn);
            } else if (currentSuppliers < DESIRED_SUPPLIERS) {
                console.log(`Spawning supplier. Current: ${currentSuppliers}, Desired: ${DESIRED_SUPPLIERS}`);
                CreepFactory.createCreep(ROLE_SUPPLIER, spawn);
            } else if (currentCouriers < DESIRED_COURIERS) {
                console.log(`Spawning courier. Current: ${currentCouriers}, Desired: ${DESIRED_COURIERS}`);
                CreepFactory.createCreep(ROLE_COURIER, spawn);
            } else if (currentRepairers < DESIRED_REPAIRERS) {
                console.log(`Spawning repairer. Current: ${currentRepairers}, Desired: ${DESIRED_REPAIRERS}`);
                CreepFactory.createCreep(ROLE_REPAIRER, spawn);
            }
        }
    }

    static renewCreeps() {
        const spawn = this.getAvailableSpawn();
        if (!spawn) return;

        const managers = _.filter(Game.creeps, (creep) => creep.memory.role === ROLE_MANAGER);
        for (const manager of managers) {
            if (manager.ticksToLive < 1200 && spawn.renewCreep(manager) === ERR_NOT_IN_RANGE) {
                manager.moveTo(spawn);
            }
        }
    }

    static getAvailableSpawn() {
        for (const name in Game.spawns) {
            const spawn = Game.spawns[name];
            if (!spawn.spawning) {
                return spawn;
            }
        }
        return null;
    }
}

module.exports = SpawnManager;