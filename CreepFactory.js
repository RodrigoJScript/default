const BodyBuilder = require('./BodyBuilder');
const NameGenerator = require('./NameGenerator');
const AssignerRole = require('./AssignerRole');

class CreepFactory {
    static createCreep(role, spawn) {
        const body = BodyBuilder.getBodyForRole(role, spawn.room.energyAvailable);
        const name = NameGenerator.generateUniqueName(role);
        const spawnOptions = {};

        if (role === 'manager') {
            spawnOptions.directions = [BOTTOM];
        }

        const result = spawn.spawnCreep(body, name, spawnOptions);

        if (result == OK) {
            AssignerRole.assignRoleToCreep(name, role, spawn.room);
        } else {
            console.log(`Failed to spawn creep ${name}. Error code: ${result}`);
        }

        return result;
    }
}

module.exports = CreepFactory;