const CreepFactory = require('./CreepFactory');
const CreepManager = require('./CreepManager');

const ROLE_HARVESTER = 'harvester';
const ROLE_BUILDER = 'builder';
const ROLE_UPGRADER = 'upgrader';

const DESIRED_HARVESTERS = 2;
const DESIRED_BUILDERS = 2;
const DESIRED_UPGRADERS = 2;

class SpawnManager {
    static run() {
        this.spawnCreepsIfNeeded();
    }

    static spawnCreepsIfNeeded() {
        const currentHarvesters = CreepManager.getCreepCountByRole(ROLE_HARVESTER);
        const currentBuilders = CreepManager.getCreepCountByRole(ROLE_BUILDER);
        const currentUpgraders = CreepManager.getCreepCountByRole(ROLE_UPGRADER);

        const spawn = this.getAvailableSpawn();

        if (spawn) {
            if (currentHarvesters < DESIRED_HARVESTERS) {
                CreepFactory.createCreep(ROLE_HARVESTER, spawn);
            } else if (currentBuilders < DESIRED_BUILDERS) {
                CreepFactory.createCreep(ROLE_BUILDER, spawn);
            } else if (currentUpgraders < DESIRED_UPGRADERS) {
                CreepFactory.createCreep(ROLE_UPGRADER, spawn);
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