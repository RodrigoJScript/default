const CreepFactory = require('./CreepFactory');
const CreepManager = require('./CreepManager');

const ROLE_HARVESTER = 'harvester';
const ROLE_BUILDER = 'builder';
const ROLE_UPGRADER = 'upgrader';
const ROLE_HAULER = 'hauler';
const ROLE_SCAVENGER = 'scavenger';

const DESIRED_HARVESTERS = 2;
const DESIRED_BUILDERS = 2;
const DESIRED_UPGRADERS = 2;
const DESIRED_HAULERS = 2;
const DESIRED_SCAVENGERS = 1;

class SpawnManager {
    static run() {
        this.spawnCreepsIfNeeded();
    }

    static spawnCreepsIfNeeded() {
        const currentHarvesters = CreepManager.getCreepCountByRole(ROLE_HARVESTER);
        const currentBuilders = CreepManager.getCreepCountByRole(ROLE_BUILDER);
        const currentUpgraders = CreepManager.getCreepCountByRole(ROLE_UPGRADER);
        const currentHaulers = CreepManager.getCreepCountByRole(ROLE_HAULER);
        const currentScavengers = CreepManager.getCreepCountByRole(ROLE_SCAVENGER);

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