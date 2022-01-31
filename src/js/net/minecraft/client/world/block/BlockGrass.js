window.BlockGrass = class extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);
    }

    getTextureForFace(face) {
        switch (face) {
            case EnumBlockFace.TOP:
                return this.textureSlotId;
            case EnumBlockFace.BOTTOM:
                return this.textureSlotId + 1;
            default:
                return this.textureSlotId + 2;
        }
    }

}