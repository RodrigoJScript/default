const ROLE_HARVESTER = 'harvester';
const ROLE_BUILDER = 'builder';
const ROLE_UPGRADER = 'upgrader';

const BODY_HARVESTER = [WORK, CARRY, MOVE];
const BODY_BUILDER = [WORK, CARRY, MOVE];
const BODY_UPGRADER = [WORK, CARRY, MOVE];

class CreepFactory {
    static createCreep(role, spawn) {
        const body = this.getBodyForRole(role);
        const name = this.generateUniqueName(role);
        const result = spawn.spawnCreep(body, name);

        if (result == OK) {
            this.assignRoleToCreep(name, role);
        }

        return result;
    }

    static getBodyForRole(role) {
        const bodyParts = {
            [ROLE_HARVESTER]: BODY_HARVESTER,
            [ROLE_BUILDER]: BODY_BUILDER,
            [ROLE_UPGRADER]: BODY_UPGRADER
        };

        return bodyParts[role] || BODY_HARVESTER;
    }

    static generateUniqueName(role) {
        return `${role}_${Game.time}`;
    }

    static assignRoleToCreep(name, role) {
        Memory.creeps[name] = { role: role, working: false };
    }
}

module.exports = CreepFactory;