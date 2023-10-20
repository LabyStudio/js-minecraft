import Block from "../Block.js";
import EnumBlockFace from "../../../../util/EnumBlockFace.js";

export default class BlockBookshelf extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);
    }

    getParticleTextureFace() {
        return EnumBlockFace.NORTH;
    }

    getTextureForFace(face) {
        switch (face) {
            case EnumBlockFace.TOP:
                return 10; // Plank texture
            case EnumBlockFace.BOTTOM:
                return 10; // Plank texture
            default:
                return this.textureSlotId;
        }
    }
}