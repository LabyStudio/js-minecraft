window.BlockWater = class extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);
    }

    getOpacity() {
        return 0.3;
    }

    isSolid() {
        return false;
    }

    canCollide() {
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