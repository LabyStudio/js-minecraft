import Block from "../Block.js";
import EnumBlockFace from "../../../../util/EnumBlockFace.js";
import BoundingBox from "../../../../util/BoundingBox.js";


export default class BlockSlab extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        this.boundingBox = new BoundingBox(0.0, 0.0, 0.0, 1.0, 0.5, 1.0);
    }

    getTextureForFace(face) {
        switch (face) {
            case EnumBlockFace.TOP:
                return this.textureSlotId - 1;
            case EnumBlockFace.BOTTOM:
                return this.textureSlotId - 1;
            default:
                return this.textureSlotId;
        }
    }

    shouldRenderFace(world, x, y, z, face) {
        if (face === EnumBlockFace.TOP) {
            return true;
        }
        let typeId = world.getBlockAtFace(x, y, z, face);
        if (typeId === 0) {
            return true;
        }

        let block = Block.getById(typeId);
        return block === null || block.isTranslucent();
    }

    isTranslucent() {
        return true;
    }
}