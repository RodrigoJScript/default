const MemoryManager = require('MemoryManager');

module.exports.loop = function () {
    MemoryManager.cleanCreepMemory();
}