const CreepRole = require("./CreepRole");

class RoleScavenger extends CreepRole {
    constructor(creep) {
        super(creep);
    }

    run() {
        // Toggle working state based on energy levels
        if (this.creep.memory.working && this.creep.store.getFreeCapacity() == 0) {
            this.creep.memory.working = false;
        }
        if (!this.creep.memory.working && this.creep.store[RESOURCE_ENERGY] == 0) {
            this.creep.memory.working = true;
        }

        if (this.creep.memory.working) {
            // Find the closest tombstone with energy
            let target = this.creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                filter: (tombstone) => tombstone.store[RESOURCE_ENERGY] > 0
            });

            // If no tombstones with energy, find the closest dropped energy
            if (!target) {
                target = this.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                    filter: (resource) => resource.resourceType == RESOURCE_ENERGY
                });
            }

            // If no energy found, find other resources if storage is available
            if (!target) {
                const storage = this.creep.room.storage;
                if (storage && storage.store.getFreeCapacity() > 0) {
                    target = this.creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                        filter: (tombstone) => tombstone.store.getUsedCapacity() > 0
                    });

                    if (!target) {
                        target = this.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                    }
                }
            }

            if (target) {
                if (target instanceof Resource) {
                    if (this.creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        this.enhancedMoveTo(target);
                    }
                } else {
                    for (const resourceType in target.store) {
                        if (this.creep.withdraw(target, resourceType) == ERR_NOT_IN_RANGE) {
                            this.enhancedMoveTo(target);
                        }
                    }
                }
            }
        } else {
            // Find the closest structure that can store resources
            let target = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            // If no suitable structure found, check for storage
            if (!target) {
                target = this.creep.room.storage;
            }

            if (target) {
                for (const resourceType in this.creep.store) {
                    if (this.creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
                        this.enhancedMoveTo(target);
                    }
                }
            }
        }
    }
}

module.exports = RoleScavenger;