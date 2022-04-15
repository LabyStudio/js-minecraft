import Block from "../Block.js";

export default class BlockLog extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        // Sound
        this.sound = Block.sounds.wood;
    }

    getTextureForFace(face) {
        return this.textureSlotId + (face.isYAxis() ? 1 : 0);
    }
}