const MemoryManager = require('./MemoryManager');
const RoleHarvester = require('./RoleHarvester');
const RoleBuilder = require('./RoleBuilder');
const RoleUpgrader = require('./RoleUpgrader');
const RoleHauler = require('./RoleHauler');
const RoleScavenger = require('./RoleScavenger');
const RoleWallFortifier = require('./RoleWallFortifier');
const RoleManager = require('./RoleManager');
const RoleSupplier = require('./RoleSupplier');
const RoleCourier = require('./RoleCourier');
const RoleAttacker = require('./RoleAttacker');
const RoleHealer = require('./RoleHealer');
const RoleRepairer = require('./RoleRepairer');

const ROLE_HARVESTER = 'harvester';
const ROLE_BUILDER = 'builder';
const ROLE_UPGRADER = 'upgrader';
const ROLE_HAULER = 'hauler';
const ROLE_SCAVENGER = 'scavenger';
const ROLE_WALL_FORTIFIER = 'wallFortifier';
const ROLE_MANAGER = 'manager';
const ROLE_SUPPLIER = 'supplier';
const ROLE_COURIER = 'courier';
const ROLE_ATTACKER = 'attacker';
const ROLE_HEALER = 'healer';
const ROLE_REPAIRER = 'repairer';
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
            [ROLE_SCAVENGER]: RoleScavenger,
            [ROLE_WALL_FORTIFIER]: RoleWallFortifier,
            [ROLE_MANAGER]: RoleManager,
            [ROLE_SUPPLIER]: RoleSupplier,
            [ROLE_COURIER]: RoleCourier,
            [ROLE_ATTACKER]: RoleAttacker,
            [ROLE_HEALER]: RoleHealer,
            [ROLE_REPAIRER]: RoleRepairer
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