const MemoryManager = require('./MemoryManager');
const RoleHarvester = require('./RoleHarvester');
const RoleBuilder = require('./RoleBuilder');
const RoleUpgrader = require('./RoleUpgrader');

class CreepManager {
    static run() {
        MemoryManager.cleanCreepMemory();
        this.manageCreeps();
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