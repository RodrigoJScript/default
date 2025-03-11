const ROLE_HARVESTER = 'harvester';
const ROLE_BUILDER = 'builder';
const ROLE_UPGRADER = 'upgrader';

class CreepFactory {
    static createCreep(role, spawn) {
        const body = this.getBodyForRole(role, spawn.room.energyAvailable);
        const name = this.generateUniqueName(role);
        const result = spawn.spawnCreep(body, name);

        if (result == OK) {
            this.assignRoleToCreep(name, role, spawn.room);
        }

        return result;
    }

    static getBodyForRole(role, energyAvailable) {
        const bodyParts = [];
        const bodyCosts = {
            'work': 100,
            'carry': 50,
            'move': 50
        };

        let remainingEnergy = energyAvailable;

        // Ensure there is enough energy for at least one work, two carry, and two move parts
        const minimumRequiredEnergy = bodyCosts['work'] + 2 * bodyCosts['carry'] + 2 * bodyCosts['move'];
        if (remainingEnergy < minimumRequiredEnergy) {
            return []; // Not enough energy to spawn a creep with the minimum required parts
        }

        // Add two carry parts first
        bodyParts.push(CARRY);
        bodyParts.push(CARRY);
        remainingEnergy -= 2 * bodyCosts['carry'];

        // Add two move parts
        bodyParts.push(MOVE);
        bodyParts.push(MOVE);
        remainingEnergy -= 2 * bodyCosts['move'];

        // Add one work part
        bodyParts.push(WORK);
        remainingEnergy -= bodyCosts['work'];

        // Add work parts with the remaining energy
        while (remainingEnergy >= bodyCosts['work']) {
            bodyParts.push(WORK);
            remainingEnergy -= bodyCosts['work'];
        }

        return bodyParts;
    }

    static generateUniqueName(role) {
        return `${role}_${Game.time}`;
    }

    static assignRoleToCreep(name, role, room) {
        const creepMemory = { role: role, working: false };

        if (role === ROLE_HARVESTER) {
            const sources = room.find(FIND_SOURCES);
            const assignedSources = _.map(_.filter(Game.creeps, (creep) => creep.memory.role === ROLE_HARVESTER), (creep) => creep.memory.sourceId);
            const availableSources = _.filter(sources, (source) => !_.includes(assignedSources, source.id));

            if (availableSources.length > 0) {
                creepMemory.sourceId = availableSources[0].id;
            } else {
                creepMemory.sourceId = sources[0].id; // Fallback to the first source if all are assigned
            }
        }

        Memory.creeps[name] = creepMemory;
    }
}

module.exports = CreepFactory;