window.BlockLog = class extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);
    }

    getTextureForFace(face) {
        return this.textureSlotId + (face.isYAxis() ? 1 : 0);
    }
}