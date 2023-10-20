import BlockRenderType from "../../../../util/BlockRenderType.js";
import BoundingBox from "../../../../util/BoundingBox.js";
import Block from "../Block.js";

export default class BlockBrownMushroom extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        this.boundingBox = new BoundingBox(0.3125, 0.0, 0.3125, 0.625, 0.5, 0.625);

        // Sound
        this.sound = Block.sounds.grass;
    }

    getRenderType() {
        return BlockRenderType.DECORATION;
    }

    isTranslucent() {
        return true;
    }
    
    isDecoration() {
        return true;
    }

    isSolid() {
        return false;
    }
}