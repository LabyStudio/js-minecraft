import Block from "../Block.js";

export default class BlockLeave extends Block {

    constructor(id, textureSlotId,metaValue) {
        super(id, textureSlotId,metaValue);

        // Sound
        this.sound = Block.sounds.dirt;
    }

    // TODO fix transparency of leaves
    /*isTranslucent() {
        return true;
    }*/

    getColor(world, x, y, z, face) {
        // Inventory items have a default color
        if (world === null) {
            return 0 << 16 | 255 << 8 | 0;
        }

        let temperature = world.getTemperature(x, y, z);
        let humidity = world.getHumidity(x, y, z);
        return world.minecraft.grassColorizer.getColor(temperature, humidity);
    }

    // TODO fix transparency of leaves
    /*shouldRenderFace(world, x, y, z, face) {
        let typeId = world.getBlockAtFace(x, y, z, face);
        return typeId === 0 || typeId === this.getId();
    }*/

    getOpacity() {
        return 0.3;
    }
}