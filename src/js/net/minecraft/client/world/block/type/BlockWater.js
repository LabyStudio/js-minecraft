import Block from "../Block.js";
import EnumBlockFace from "../../../../util/EnumBlockFace.js";

export default class BlockWater extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);
    }

    isTranslucent() {
        return true;
    }

    getOpacity() {
        return 0;
    }

    getTransparency() {
        return 0.3;
    }

    isSolid() {
        return false;
    }

    isLiquid() {
        return true;
    }

    canInteract() {
        return false;
    }

    shouldRenderFace(world, x, y, z, face) {
        let typeId = world.getBlockAtFace(x, y, z, face);

        if (typeId === 0) {
            return true;
        }

        let block = Block.getById(typeId);
        if (block === null || (block.isTranslucent() && !block.isLiquid())){
            console.log('this one');
            return true;
        }

        let topTypeId = world.getBlockAtFace(x, y+2, z, face);
        return (typeId !== this.getId() && face === EnumBlockFace.TOP) || (topTypeId !== this.getId() && face === EnumBlockFace.BOTTOM);
    }

    getBoundingBox(world, x, y, z) {
        let box = this.boundingBox.clone();
        if (world !== null && world.getBlockAt(x, y + 1, z) !== this.getId()) {
            box.maxY = 1.0 - 0.12;
        }
        return box;
    }
}