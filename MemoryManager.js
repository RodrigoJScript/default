class MemoryManager {
    static cleanCreepMemory() {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    }
}

module.exports = MemoryManager;