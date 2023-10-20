import BlockRenderType from "../../../../util/BlockRenderType.js";
import BoundingBox from "../../../../util/BoundingBox.js";
import Block from "../Block.js";

export default class BlockSapling extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        this.boundingBox = new BoundingBox(0.125, 0.0, 0.125, 0.875, 0.875, 0.875);

        // Sound
        this.sound = Block.sounds.grass;
    }

    getRenderType() {
        return BlockRenderType.DECORATION;
    }

    getOpacity() {
        return 0;
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