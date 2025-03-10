const MemoryManager = require('./MemoryManager');
const CreepManager = require('./CreepManager');
const SpawnManager = require('./SpawnManager');

module.exports.loop = function () {
    MemoryManager.cleanCreepMemory();
    CreepManager.run();
    SpawnManager.run();
}