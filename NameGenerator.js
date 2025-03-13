class NameGenerator {
    static generateUniqueName(role) {
        return `${role}_${Game.time}`;
    }
}

module.exports = NameGenerator;