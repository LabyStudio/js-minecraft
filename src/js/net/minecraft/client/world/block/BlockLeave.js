import Block from "./Block.js";

export default class BlockLeave extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        // Sound
        this.sound = Block.sounds.grass;
    }

    getOpacity() {
        return 0.3;
    }
}