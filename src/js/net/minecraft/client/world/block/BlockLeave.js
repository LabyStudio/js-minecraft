window.BlockLeave = class extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        // Sound
        this.sound = Block.sounds.grass;
    }

    getOpacity() {
        return 0.3;
    }
}