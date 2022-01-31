window.BlockLeave = class extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);
    }

    getOpacity() {
        return 0.3;
    }
}