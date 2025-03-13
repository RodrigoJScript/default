class RoleAssigner {
    static assignRoleToCreep(name, role, room) {
        const creepMemory = { role: role, working: false };

        if (role === 'harvester') {
            this.assignHarvesterSource(creepMemory, room);
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
            creepMemory.sourceId = sources[0].id; // Fallback to the first source if all are assigned
        }
    }
}

module.exports = RoleAssigner;