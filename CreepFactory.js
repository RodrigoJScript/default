const BodyBuilder = require('./BodyBuilder');
const NameGenerator = require('./NameGenerator');
const RoleAssigner = require('./RoleAssigner');

class CreepFactory {
    static createCreep(role, spawn) {
        const body = BodyBuilder.getBodyForRole(role, spawn.room.energyAvailable);
        const name = NameGenerator.generateUniqueName(role);
        const result = spawn.spawnCreep(body, name);

        if (result == OK) {
            RoleAssigner.assignRoleToCreep(name, role, spawn.room);
        } else {
            console.log(`Failed to spawn creep ${name}. Error code: ${result}`);
        }

        return result;
    }
}

module.exports = CreepFactory;