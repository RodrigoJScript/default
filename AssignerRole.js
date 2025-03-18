class AssignerRole {
    static assignRoleToCreep(name, role, room) {
        const creepMemory = { role: role, working: false };

        if (role === 'harvester') {
            this.assignHarvesterSource(creepMemory, room);
        } else if (role === 'hauler') {
            this.assignHaulerContainer(creepMemory, room);
        } else if (role === 'manager') {
            this.assignManagerLink(creepMemory, room);
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

    static assignManagerLink(creepMemory, room) {
        const storage = room.storage;
        if (!storage) return;

        const links = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_LINK }
        });

        let closestLink = null;
        let minDistance = Infinity;

        for (const link of links) {
            const distance = storage.pos.getRangeTo(link);
            if (distance < minDistance) {
                minDistance = distance;
                closestLink = link;
            }
        }

        if (closestLink) {
            creepMemory.linkId = closestLink.id;
        }
    }
}

module.exports = AssignerRole;