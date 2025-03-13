class RoleAssigner {
    static assignRoleToCreep(name, role, room) {
        const creepMemory = { role: role, working: false };

        if (role === 'harvester') {
            this.assignHarvesterSource(creepMemory, room);
        } else if (role === 'hauler') {
            this.assignHaulerContainer(creepMemory, room);
        }

        Memory.creeps[name] = creepMemory;
    }

    static assignHarvesterSource(creepMemory, room) {
        const sources = room.find(FIND_SOURCES);
        const assignedSources = _.map(_.filter(Game.creeps, (creep) => creep.memory.role === 'harvester'), (creep) => creep.memory.sourceId);
        const availableSources = _.filter(sources, (source) => !_.includes(assignedSources, source.id));

        if (availableSources.length > 0) {
            creepMemory.sourceId = availableSources[0].id;
        } else {
            creepMemory.sourceId = sources[0].id;
        }
    }

    static assignHaulerContainer(creepMemory, room) {
        const containers = room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER
        });
        const assignedContainers = _.map(_.filter(Game.creeps, (creep) => creep.memory.role === 'hauler'), (creep) => creep.memory.containerId);
        const availableContainers = _.filter(containers, (container) => !_.includes(assignedContainers, container.id));

        if (availableContainers.length > 0) {
            creepMemory.containerId = availableContainers[0].id;
        } else {
            creepMemory.containerId = containers[0].id;
        }
    }
}

module.exports = RoleAssigner;