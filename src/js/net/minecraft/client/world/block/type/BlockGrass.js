import Block from "../Block.js";
import EnumBlockFace from "../../../../util/EnumBlockFace.js";

export default class BlockGrass extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        // Sound
        this.sound = Block.sounds.grass;
    }

    getColor(world, x, y, z, face) {
        // Only top face has a biome color
        if (face !== EnumBlockFace.TOP) {
            return 0xFFFFFF;
        }

        // Inventory items have a default color
        if (world === null) {
            return 0x7cbd6b;
        }

        let temperature = world.getTemperature(x, y, z);
        let humidity = world.getHumidity(x, y, z);
        return world.minecraft.grassColorizer.getColor(temperature, humidity);
    }

    getParticleTextureFace() {
        return EnumBlockFace.NORTH;
    }

    getTextureForFace(face) {
        switch (face) {
            case EnumBlockFace.TOP:
                return this.textureSlotId;
            case EnumBlockFace.BOTTOM:
                return this.textureSlotId + 1;
            default:
                return this.textureSlotId + 2;
        }
    }

}