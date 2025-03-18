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
            const numberOfPairs = Math.min(12, Math.floor(remainingEnergy / pairCost));

            for (let i = 0; i < numberOfPairs; i++) {
                bodyParts.push(CARRY);
                bodyParts.push(MOVE);
            }

            return bodyParts;
        }

        if (role === 'scavenger') {
            const minimumRequiredEnergy = 4 * bodyCosts['move'] + 2 * bodyCosts['carry'];
            if (remainingEnergy < minimumRequiredEnergy) {
                return [];
            }

            for (let i = 0; i < 4; i++) {
                bodyParts.push(MOVE);
            }

            for (let i = 0; i < 2; i++) {
                bodyParts.push(CARRY);
            }

            return bodyParts;
        }

        if (role === 'manager') {
            const minimumRequiredEnergy = 16 * bodyCosts['carry'] + bodyCosts['move'];
            if (remainingEnergy < minimumRequiredEnergy) {
                return [];
            }

            for (let i = 0; i < 16; i++) {
                bodyParts.push(CARRY);
            }

            bodyParts.push(MOVE);

            return bodyParts;
        }

        const minimumRequiredEnergy = bodyCosts['work'] + 2 * bodyCosts['carry'] + 2 * bodyCosts['move'];
        if (remainingEnergy < minimumRequiredEnergy) {
            return [];
        }

        remainingEnergy = this.addBodyParts(bodyParts, CARRY, 2, bodyCosts['carry'], remainingEnergy);
        remainingEnergy = this.addBodyParts(bodyParts, MOVE, 2, bodyCosts['move'], remainingEnergy);
        remainingEnergy = this.addBodyParts(bodyParts, WORK, 1, bodyCosts['work'], remainingEnergy);

        let workPartsCount = 1;
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