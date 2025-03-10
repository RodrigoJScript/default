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
        switch (role) {
            case 'harvester':
                return [WORK, CARRY, MOVE];
            case 'builder':
                return [WORK, CARRY, MOVE];
            case 'upgrader':
                return [WORK, CARRY, MOVE];
            default:
                return [WORK, CARRY, MOVE];
        }
    }

    static generateUniqueName(role) {
        return `${role}_${Game.time}`;
    }

    static assignRoleToCreep(name, role) {
        Memory.creeps[name] = { role: role };
    }
}

module.exports = CreepFactory;