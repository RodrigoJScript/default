const MemoryManager = require('./MemoryManager');
const CreepManager = require('./CreepManager');
const SpawnManager = require('./SpawnManager');
const StructureTower = require('./StructureTower');

module.exports.loop = function () {
    MemoryManager.cleanCreepMemory();
    CreepManager.run();
    SpawnManager.run();
    StructureTower.runAll();
}