const MemoryManager = require('./MemoryManager');
const CreepManager = require('./CreepManager');
const SpawnManager = require('./SpawnManager');
const StructureTower = require('./StructureTower');

module.exports.loop = function () {
    MemoryManager.cleanCreepMemory();
    CreepManager.run();
    SpawnManager.run();
    StructureTower.runAll();
    
        if (Game.cpu.bucket >= 5000) {
        const result = Game.cpu.generatePixel();
        if (result === OK) {
            console.log("Pixel generado exitosamente.");
        } else {
            console.log(`Error al generar pixel: ${result}`);
        }
    }
}