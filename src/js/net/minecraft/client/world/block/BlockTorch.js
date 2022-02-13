window.BlockTorch = class extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        this.boundingBox = new BoundingBox(0.4, 0.0, 0.4, 0.6, 0.6, 0.6);
    }

    getLightValue() {
        return 14;
    }

    isSolid() {
        return false;
    }

    getRenderType() {
        return BlockRenderType.TORCH;
    }
}