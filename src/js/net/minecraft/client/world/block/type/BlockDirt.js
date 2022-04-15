import Block from "../Block.js";

export default class BlockDirt extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        // Sound
        this.sound = Block.sounds.gravel;
    }

}