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

        const minimumRequiredEnergy = bodyCosts['work'] + bodyCosts['carry'] + bodyCosts['move'];
        if (remainingEnergy < minimumRequiredEnergy) {
            return [];
        }

        bodyParts.push(CARRY);
        remainingEnergy -= bodyCosts['carry'];

        bodyParts.push(MOVE);
        remainingEnergy -= bodyCosts['move'];

        bodyParts.push(WORK);
        remainingEnergy -= bodyCosts['work'];

        const maxParts = Math.floor(remainingEnergy / 50);
        const moveParts = Math.ceil(maxParts / 5);

        for (let i = 0; i < moveParts && remainingEnergy >= bodyCosts['move']; i++) {
            bodyParts.push(MOVE);
            remainingEnergy -= bodyCosts['move'];
        }

        while (remainingEnergy >= bodyCosts['work']) {
            bodyParts.push(WORK);
            remainingEnergy -= bodyCosts['work'];
        }

        const totalParts = bodyParts.length;
        const requiredMoveParts = Math.ceil(totalParts / 5);
        while (bodyParts.filter(part => part === MOVE).length < requiredMoveParts && remainingEnergy >= bodyCosts['move']) {
            bodyParts.push(MOVE);
            remainingEnergy -= bodyCosts['move'];
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