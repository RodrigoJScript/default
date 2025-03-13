class BodyBuilder {
    static getBodyForRole(role, energyAvailable) {
        const bodyParts = [];
        const bodyCosts = {
            'work': 100,
            'carry': 50,
            'move': 50
        };

        let remainingEnergy = energyAvailable;

        const minimumRequiredEnergy = bodyCosts['work'] + 2 * bodyCosts['carry'] + 2 * bodyCosts['move'];
        if (remainingEnergy < minimumRequiredEnergy) {
            return [];
        }

        remainingEnergy = this.addBodyParts(bodyParts, CARRY, 2, bodyCosts['carry'], remainingEnergy);
        remainingEnergy = this.addBodyParts(bodyParts, MOVE, 2, bodyCosts['move'], remainingEnergy);
        remainingEnergy = this.addBodyParts(bodyParts, WORK, 1, bodyCosts['work'], remainingEnergy);

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