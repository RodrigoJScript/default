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
            // Find the closest tombstone with resources
            let target = this.creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                filter: (tombstone) => tombstone.store.getUsedCapacity() > 0
            });

            // If no tombstones with resources, find the closest dropped resource
            if (!target) {
                target = this.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
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
            // Find the closest structure that can store energy
            let target = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_TOWER ) &&
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

        // Check containers for non-energy resources and transfer them to storage
        const containers = this.creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
        });

        for (const container of containers) {
            for (const resourceType in container.store) {
                if (resourceType !== RESOURCE_ENERGY) {
                    if (this.creep.withdraw(container, resourceType) == ERR_NOT_IN_RANGE) {
                        this.enhancedMoveTo(container);
                    } else if (this.creep.store.getFreeCapacity() == 0) {
                        const storage = this.creep.room.storage;
                        if (storage && this.creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                            this.enhancedMoveTo(storage);
                        }
                    }
                }
            }
        }
    }
}

module.exports = RoleScavenger;