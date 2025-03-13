const MemoryManager = require('./MemoryManager');
const RoleHarvester = require('./RoleHarvester');
const RoleBuilder = require('./RoleBuilder');
const RoleUpgrader = require('./RoleUpgrader');
const RoleHauler = require('./RoleHauler');
const RoleScavenger = require('./RoleScavenger');

const ROLE_HARVESTER = 'harvester';
const ROLE_BUILDER = 'builder';
const ROLE_UPGRADER = 'upgrader';
const ROLE_HAULER = 'hauler';
const ROLE_SCAVENGER = 'scavenger';

class CreepManager {
    static run() {
        MemoryManager.cleanCreepMemory();
        this.manageCreeps();
    }

    static manageCreeps() {
        const roleClasses = {
            [ROLE_HARVESTER]: RoleHarvester,
            [ROLE_BUILDER]: RoleBuilder,
            [ROLE_UPGRADER]: RoleUpgrader,
            [ROLE_HAULER]: RoleHauler,
            [ROLE_SCAVENGER]: RoleScavenger
        };

        for (let name in Game.creeps) {
            const creep = Game.creeps[name];
            const role = creep.memory.role;
            const RoleClass = roleClasses[role];

            if (RoleClass) {
                new RoleClass(creep).run();
            }
        }
    }

    static getCreepCountByRole(role) {
        return _.sum(Game.creeps, (creep) => creep.memory.role == role);
    }
}

module.exports = CreepManager;