const CreepFactory = require('./CreepFactory');
const CreepManager = require('./CreepManager');

class SpawnManager {
    static run() {
        this.spawnCreepsIfNeeded();
    }

    static spawnCreepsIfNeeded() {
        const desiredHarvesters = 2;
        const desiredBuilders = 4;
        const desiredUpgraders = 2;

        const currentHarvesters = CreepManager.getCreepCountByRole('harvester');
        const currentBuilders = CreepManager.getCreepCountByRole('builder');
        const currentUpgraders = CreepManager.getCreepCountByRole('upgrader');

        const spawn = this.getAvailableSpawn();

        if (spawn) {
            if (currentHarvesters < desiredHarvesters) {
                CreepFactory.createCreep('harvester', spawn);
            } else if (currentBuilders < desiredBuilders) {
                CreepFactory.createCreep('builder', spawn);
            } else if (currentUpgraders < desiredUpgraders) {
                CreepFactory.createCreep('upgrader', spawn);
            }
        }
    }

    static getAvailableSpawn() {
        for (let name in Game.spawns) {
            const spawn = Game.spawns[name];
            if (!spawn.spawning) {
                return spawn;
            }
        }
        return null;
    }
}

module.exports = SpawnManager;