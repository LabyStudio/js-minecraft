window.BlockTorch = class extends Block {

    constructor(id, textureSlotId) {
        super(id, textureSlotId);

        this.boundingBox = new BoundingBox(0.4, 0.0, 0.4, 0.6, 0.6, 0.6);

        this.dataFaces = [
            EnumBlockFace.WEST,
            EnumBlockFace.EAST,
            EnumBlockFace.NORTH,
            EnumBlockFace.SOUTH,
            EnumBlockFace.BOTTOM,
        ]
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

    onBlockAdded(world, x, y, z) {
        for (let i = this.dataFaces.length - 1; i >= 0; i--) {
            let dataFace = this.dataFaces[i];

            if (world.isSolidBlockAt(x + dataFace.x, y + dataFace.y, z + dataFace.z)) {
                world.setBlockDataAt(x, y, z, i + 1);
                break;
            }
        }
    }

    onBlockPlaced(world, x, y, z, face) {
        let meta = world.getBlockDataAt(x, y, z);

        for (let i in this.dataFaces) {
            let dataFace = this.dataFaces[i];

            if (face === dataFace.opposite() && world.isSolidBlockAt(x + dataFace.x, y + dataFace.y, z + dataFace.z)) {
                meta = parseInt(i) + 1;
                break;
            }
        }

        world.getChunkSectionAt(x >> 4, y >> 4, z >> 4).setBlockDataAt(x & 15, y & 15, z & 15, meta);
    }
}