import Block from "../Block.js";

export default class BlockLeave extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        // Sound
        this.sound = Block.sounds.grass;
    }

    getColor(world, x, y, z, face) {
        // Inventory items have a default color
        if (world === null) {
            return 0 << 16 | 255 << 8 | 0;
        }

        let temperature = world.getTemperature(x, y, z);
        let humidity = world.getHumidity(x, y, z);
        return world.minecraft.grassColorizer.getColor(temperature, humidity);
    }

    getOpacity() {
        return 0.3;
    }
}