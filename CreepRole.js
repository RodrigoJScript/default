class creepRole {
    constructor(creep) {
        this.creep = creep;
    }

    perfomRole() {
        this.run();
    }

    run() {
        console.log('This is the base class run method');
    }

}
module.exports = creepRole;