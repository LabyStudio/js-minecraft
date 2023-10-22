import Block from "../Block.js";

export default class BlockWool extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        // Sound
        this.sound = Block.sounds.cloth;
    }

}