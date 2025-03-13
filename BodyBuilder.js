class BodyBuilder {
    static getBodyForRole(role, energyAvailable) {
        const bodyParts = [];
        const bodyCosts = {
            'work': 100,
            'carry': 50,
            'move': 50
        };

        let remainingEnergy = energyAvailable;

        if (role === 'hauler') {
            // Ensure there is enough energy for at least one carry and one move part
            const minimumRequiredEnergy = bodyCosts['carry'] + bodyCosts['move'];
            if (remainingEnergy < minimumRequiredEnergy) {
                return []; // Not enough energy to spawn a hauler with the minimum required parts
            }

            // Add carry and move parts in equal amounts
            while (remainingEnergy >= bodyCosts['carry'] + bodyCosts['move']) {
                bodyParts.push(CARRY);
                bodyParts.push(MOVE);
                remainingEnergy -= bodyCosts['carry'] + bodyCosts['move'];
            }

            return bodyParts;
        }

        // Ensure there is enough energy for at least one work, two carry, and two move parts
        const minimumRequiredEnergy = bodyCosts['work'] + 2 * bodyCosts['carry'] + 2 * bodyCosts['move'];
        if (remainingEnergy < minimumRequiredEnergy) {
            return []; // Not enough energy to spawn a creep with the minimum required parts
        }

        // Add two carry parts first
        remainingEnergy = this.addBodyParts(bodyParts, CARRY, 2, bodyCosts['carry'], remainingEnergy);
        // Add two move parts
        remainingEnergy = this.addBodyParts(bodyParts, MOVE, 2, bodyCosts['move'], remainingEnergy);
        // Add one work part
        remainingEnergy = this.addBodyParts(bodyParts, WORK, 1, bodyCosts['work'], remainingEnergy);

        // Add work parts with the remaining energy
        while (remainingEnergy >= bodyCosts['work']) {
            bodyParts.push(WORK);
            remainingEnergy -= bodyCosts['work'];
        }

        return bodyParts;
    }

    static addBodyParts(bodyParts, part, count, cost, remainingEnergy) {
        for (let i = 0; i < count; i++) {
            if (remainingEnergy >= cost) {
                bodyParts.push(part);
                remainingEnergy -= cost;
            } else {
                break;
            }
        }
        return remainingEnergy;
    }
}

module.exports = BodyBuilder;