window.Block = class {

    static blocks = [];

    static create() {
        Block.STONE = new BlockStone(1, 0);
        Block.GRASS = new BlockGrass(2, 1);
        Block.DIRT = new BlockDirt(3, 2);
        Block.LOG = new BlockLog(17, 4);
        Block.LEAVE = new BlockLeave(18, 6);
        Block.WATER = new BlockWater(9, 7);
        Block.SAND = new BlockSand(12, 8)
    }

    constructor(id, textureSlotId = id) {
        this.id = id;
        this.textureSlotId = textureSlotId;

        this.boundingBox = new BoundingBox(0.0, 0.0, 0.0, 1.0, 1.0, 1.0);

        // Register block
        Block.blocks[id] = this;
    }

    getId() {
        return this.id;
    }

    getTextureForFace(face) {
        return this.textureSlotId;
    }

    isTransparent() {
        return this.getOpacity() < 1.0;
    }

    shouldRenderFace(world, x, y, z, face) {
        let typeId = world.getBlockAt(x + face.x, y + face.y, z + face.z);
        return typeId === 0 || Block.getById(typeId).isTransparent();
    }

    isSolid() {
        return true;
    }

    getOpacity() {
        return 1.0;
    }

    getBoundingBox(world, x, y, z) {
        return this.boundingBox;
    }

    static getById(typeId) {
        return Block.blocks[typeId];
    }

}