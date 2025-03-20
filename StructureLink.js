class StructureLink {
    static run(link) {
        if (!link) {
            return;
        }

        const centralLink = this.getCentralLink(link.room);
        if (link.id !== centralLink.id && link.store[RESOURCE_ENERGY] >= 400) {
            if (link.cooldown === 0) {
                link.transferEnergy(centralLink);
            }
        }
    }

    static getCentralLink(room) {
        const spawn = room.find(FIND_MY_SPAWNS)[0];
        const links = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_LINK }
        });

        let centralLink = null;
        let minDistance = Infinity;

        for (const link of links) {
            const distance = spawn.pos.getRangeTo(link);
            if (distance < minDistance) {
                minDistance = distance;
                centralLink = link;
            }
        }

        return centralLink;
    }

    static runAll() {
        const links = _.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_LINK);
        for (const link of links) {
            this.run(link);
        }
    }
}

module.exports = StructureLink;