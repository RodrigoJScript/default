const ROLE_HARVESTER = 'harvester';
const ROLE_BUILDER = 'builder';
const ROLE_UPGRADER = 'upgrader';

class CreepFactory {
    static createCreep(role, spawn) {
        const body = this.getBodyForRole(role, spawn.room.energyAvailable);
        const name = this.generateUniqueName(role);
        const result = spawn.spawnCreep(body, name);

        if (result == OK) {
            this.assignRoleToCreep(name, role);
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

        if (remainingEnergy >= bodyCosts['carry']) {
            bodyParts.push(CARRY);
            remainingEnergy -= bodyCosts['carry'];
        }

        const maxParts = Math.floor(energyAvailable / 50);
        const moveParts = Math.ceil(maxParts / 2);

        for (let i = 0; i < moveParts && remainingEnergy >= bodyCosts['move']; i++) {
            bodyParts.push(MOVE);
            remainingEnergy -= bodyCosts['move'];
        }

        while (remainingEnergy >= 50) {
            if (remainingEnergy >= bodyCosts['work']) {
                bodyParts.push(WORK);
                remainingEnergy -= bodyCosts['work'];
            }
            if (remainingEnergy >= bodyCosts['move']) {
                bodyParts.push(MOVE);
                remainingEnergy -= bodyCosts['move'];
            }
        }

        return bodyParts;
    }

    static generateUniqueName(role) {
        return `${role}_${Game.time}`;
    }

    static assignRoleToCreep(name, role) {
        Memory.creeps[name] = { role: role, working: false };
    }
}

module.exports = CreepFactory;