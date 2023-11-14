//KSKS
import Block from "../Block.js";
import EnumBlockFace from "../../../../util/EnumBlockFace.js";

export default class BlockJelly extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);
    }

    getOpacity() {
        return 0.01;
    }

    getTransparency() {
        return 0.2;
    }

    isSolid() {
        return true;
    }

    isLiquid() {
        return false;
    }

    canInteract() {
        return true;
    }

    shouldRenderFace(world, x, y, z, face) {
        let typeId = world.getBlockAtFace(x, y, z, face);
        return typeId === 0 || typeId !== this.id || typeId !== this.id && face === EnumBlockFace.TOP;
    }
}