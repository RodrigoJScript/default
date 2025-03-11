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

    enhancedMoveTo(target, options = {}) {
        if (!this.creep.memory._move || this.creep.memory._move.dest !== target.id) {
            const path = PathFinder.search(this.creep.pos, { pos: target.pos, range: 1 }, {
                plainCost: 2,
                swampCost: 10,
                roomCallback: (roomName) => {
                    let room = Game.rooms[roomName];
                    if (!room) return;
                    let costs = new PathFinder.CostMatrix;

                    room.find(FIND_STRUCTURES).forEach((structure) => {
                        if (structure.structureType === STRUCTURE_ROAD) {
                            costs.set(structure.pos.x, structure.pos.y, 1);
                        } else if (structure.structureType !== STRUCTURE_CONTAINER &&
                            (structure.structureType !== STRUCTURE_RAMPART ||
                                !structure.my)) {
                            costs.set(structure.pos.x, structure.pos.y, 0xff);
                        }
                    });

                    room.find(FIND_CREEPS).forEach((creep) => {
                        costs.set(creep.pos.x, creep.pos.y, 0xff);
                    });

                    return costs;
                }
            });

            this.creep.memory._move = {
                dest: target.id,
                path: path.path
            };
        }

        const moveResult = this.creep.moveByPath(this.creep.memory._move.path);

        if (moveResult === ERR_NOT_FOUND || moveResult === ERR_INVALID_ARGS) {
            this.creep.memory._move = null;
        }

        return moveResult;
    }
}

module.exports = CreepRole;