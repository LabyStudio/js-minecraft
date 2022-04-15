import Block from "../Block.js";

export default class BlockWater extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);
    }

    getOpacity() {
        return 0.01;
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
        return typeId === 0 || typeId !== this.id && Block.getById(typeId).isTransparent();
    }

    getBoundingBox(world, x, y, z) {
        let box = this.boundingBox.clone();
        if (world.getBlockAt(x, y + 1, z) !== this.id) {
            box.maxY = 1.0 - 0.12;
        }
        return box;
    }
}