module.exports.loop = function () {

    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Spawn new creeps if needed
    const spawn = Game.spawns['Spawn1'];
    if (spawn && spawn.spawning === null) {
        const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
        if (harvesters.length < 2) {
            const newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester:', newName);
            spawn.spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'harvester' } });
        }
    }

    // Run creep roles
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            runHarvester(creep);
        }
    }
};

function runHarvester(creep) {
    if (creep.store.getFreeCapacity() > 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    } else {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (targets.length > 0) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
}