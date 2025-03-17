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
            const minimumRequiredEnergy = bodyCosts['carry'] + bodyCosts['move'];
            if (remainingEnergy < minimumRequiredEnergy) {
                return [];
            }

            const pairCost = bodyCosts['carry'] + bodyCosts['move'];
            const numberOfPairs = Math.min(10, Math.floor(remainingEnergy / pairCost));

            for (let i = 0; i < numberOfPairs; i++) {
                bodyParts.push(CARRY);
                bodyParts.push(MOVE);
            }

            return bodyParts;
        }

        if (role === 'scavenger') {
            // Ensure there is enough energy for 4 move parts and 2 carry parts
            const minimumRequiredEnergy = 4 * bodyCosts['move'] + 2 * bodyCosts['carry'];
            if (remainingEnergy < minimumRequiredEnergy) {
                return []; // Not enough energy to spawn a scavenger with the required parts
            }

            // Add 4 move parts
            for (let i = 0; i < 4; i++) {
                bodyParts.push(MOVE);
            }

            // Add 2 carry parts
            for (let i = 0; i < 2; i++) {
                bodyParts.push(CARRY);
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

        // Add work parts with the remaining energy, up to a maximum of 5 work parts
        let workPartsCount = 1; // Already added one work part
        while (remainingEnergy >= bodyCosts['work'] && workPartsCount < 6) {
            bodyParts.push(WORK);
            remainingEnergy -= bodyCosts['work'];
            workPartsCount++;
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