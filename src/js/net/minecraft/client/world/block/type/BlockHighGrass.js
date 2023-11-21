import BlockRenderType from "../../../../util/BlockRenderType.js";
import BoundingBox from "../../../../util/BoundingBox.js";
import Block from "../Block.js";

export default class BlockHighGrass extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        this.boundingBox = new BoundingBox(0.125, 0.0, 0.125, 0.875, 0.875, 0.875);

        // Sound
        this.sound = Block.sounds.dirt;
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