class StructureLink {
    static run(link) {
        if (!link) {
            return;
        }

        // Obtener los links desde la memoria
        const linkUpgrade = Game.getObjectById(Memory.linkUpgrade);
        const linkCentral = Game.getObjectById(Memory.linkCentral);

        // Si este link es el linkUpgrade, no enviar energía a nadie
        if (linkUpgrade && link.id === linkUpgrade.id) {
            return; // Salir sin realizar ninguna acción
        }

        // Si este link es el linkCentral, no enviar energía a nadie
        if (linkCentral && link.id === linkCentral.id) {
            return; // Salir sin realizar ninguna acción
        }

        // Si este link no es el linkCentral ni el linkUpgrade
        if (link.store[RESOURCE_ENERGY] >= 300) {
            if (link.cooldown === 0) {
                // Decidir a dónde enviar la energía
                if (linkUpgrade && linkUpgrade.store[RESOURCE_ENERGY] < 150) {
                    // Enviar al linkUpgrade si tiene menos de 150 de energía
                    link.transferEnergy(linkUpgrade, 800);
                } else if (linkCentral) {
                    // Enviar al linkCentral si el linkUpgrade tiene suficiente energía
                    link.transferEnergy(linkCentral, 800);
                }
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