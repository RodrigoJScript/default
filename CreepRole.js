class CreepRole {
    constructor(creep) {
        this.creep = creep;
    }

    performRole() {
        this.run();
    }

    run() {
        throw new Error('The run method should be implemented by subclasses');
    }
}

module.exports = CreepRole;