const MemoryManager = require('./MemoryManager');
const CreepFactory = require('./CreepFactory');
const RoleHarvester = require('./RoleHarvester');
const RoleBuilder = require('./RoleBuilder');
const RoleUpgrader = require('./RoleUpgrader');

class CreepManager {
    static run() {
        MemoryManager.cleanCreepMemory();

        this.manageCreeps();

        this.spawnCreepsIfNeeded();
    }

    static manageCreeps() {
        for (let name in Game.creeps) {
            const creep = Game.creeps[name];
            const role = creep.memory.role;

            switch (role) {
                case 'harvester':
                    new RoleHarvester(creep).run();
                    break;
                case 'builder':
                    new RoleBuilder(creep).run();
                    break;
                case 'upgrader':
                    new RoleUpgrader(creep).run();
                    break;
            }
        }
    }

    static spawnCreepsIfNeeded() {
        const desiredHarvesters = 2;
        const desiredBuilders = 4;
        const desiredUpgraders = 2;

        const currentHarvesters = this.getCreepCountByRole('harvester');
        const currentBuilders = this.getCreepCountByRole('builder');
        const currentUpgraders = this.getCreepCountByRole('upgrader');

        if (currentHarvesters < desiredHarvesters) {
            CreepFactory.createCreep('harvester', Game.spawns['Spawn1']);
        } else if (currentBuilders < desiredBuilders) {
            CreepFactory.createCreep('builder', Game.spawns['Spawn1']);
        } else if (currentUpgraders < desiredUpgraders) {
            CreepFactory.createCreep('upgrader', Game.spawns['Spawn1']);
        }
    }

    static getCreepCountByRole(role) {
        let count = 0;
        for (let name in Game.creeps) {
            if (Game.creeps[name].memory.role == role) {
                count++;
            }
        }
        return count;
    }
}

module.exports = CreepManager;