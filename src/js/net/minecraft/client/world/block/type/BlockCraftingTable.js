import GuiContainerCraftingTable from "../../../gui/screens/container/GuiContainerCraftingTable.js";
import EnumBlockFace from "../../../../util/EnumBlockFace.js";
import Block from "../Block.js";

export default class BlockCraftingTable extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);
    }

    getGuiLeftMouseCliked() {
        return GuiContainerCraftingTable
    }

    getParticleTextureFace() {
        return EnumBlockFace.NORTH;
    }

    getTextureForFace(face) {
        switch (face) {
            case EnumBlockFace.BOTTOM:
                return this.textureSlotId + 3;
            case EnumBlockFace.TOP:
                return this.textureSlotId;
            case EnumBlockFace.SOUTH:
            case EnumBlockFace.NORTH:
                return this.textureSlotId + 1;
            default:
                return this.textureSlotId + 2;
        }
    }
}