const MemoryManager = require('./MemoryManager');
const CreepManager = require('./CreepManager');
const SpawnManager = require('./SpawnManager');
const StructureTower = require('./StructureTower');

module.exports.loop = function () {
    MemoryManager.cleanCreepMemory();
    CreepManager.run();
    SpawnManager.run();

    const towers = _.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_TOWER);
    for (const tower of towers) {
        StructureTower.run(tower);
    }
}