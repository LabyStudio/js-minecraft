import Block from "../Block.js";
import EnumBlockFace from "../../../../util/EnumBlockFace.js";

export default class BlockTNT extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        // Sound
        this.sound = Block.sounds.dirt;
    }

    getParticleTextureFace() {
        return EnumBlockFace.NORTH;
    }

    getTextureForFace(face) {
        switch (face) {
            case EnumBlockFace.TOP:
                return this.textureSlotId + 1;
            case EnumBlockFace.BOTTOM:
                return this.textureSlotId - 1;
            default:
                return this.textureSlotId;
        }
    }
}