import Block from "../Block.js";

export default class BlockWool extends Block {

    constructor(id, textureSlotId,metaValue) {
        super(id, textureSlotId,metaValue);

        // Sound
        this.sound = Block.sounds.cloth;
    }

}