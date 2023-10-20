import BlockRenderType from "../../../../util/BlockRenderType.js";
import Block from "../Block.js";

export default class BlockSapling extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        // Sound
        this.sound = Block.sounds.grass;
    }

    getRenderType() {
        return BlockRenderType.DECORATION;
    }

    isTranslucent() {
        return true;
    }

    isSolid() {
        return false;
    }
}