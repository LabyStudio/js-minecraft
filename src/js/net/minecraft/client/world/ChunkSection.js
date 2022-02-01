window.ChunkSection = class {

    static SIZE = 16;

    constructor(world, x, y, z) {
        this.world = world;
        this.x = x;
        this.y = y;
        this.z = z;

        this.group = new THREE.Object3D();
        this.group.matrixAutoUpdate = false;
        this.dirty = true;

        this.blocks = [];
        for (let x = 0; x < ChunkSection.SIZE; x++) {
            for (let y = 0; y < ChunkSection.SIZE; y++) {
                for (let z = 0; z < ChunkSection.SIZE; z++) {
                    this.setBlockAt(x, y, z, 0);
                }
            }
        }
    }

    rebuild(renderer) {
        this.dirty = false;
        this.group.clear();

        for (let x = 0; x < ChunkSection.SIZE; x++) {
            for (let y = 0; y < ChunkSection.SIZE; y++) {
                for (let z = 0; z < ChunkSection.SIZE; z++) {
                    let typeId = this.getBlockAt(x, y, z);

                    if (typeId !== 0) {
                        let absoluteX = this.x * ChunkSection.SIZE + x;
                        let absoluteY = this.y * ChunkSection.SIZE + y;
                        let absoluteZ = this.z * ChunkSection.SIZE + z;

                        let block = Block.getById(typeId);
                        renderer.blockRenderer.renderBlock(this.world, this.group, block, absoluteX, absoluteY, absoluteZ);
                    }
                }
            }
        }
    }

    getBlockAt(x, y, z) {
        let index = y << 8 | z << 4 | x;
        return this.blocks[index];
    }

    setBlockAt(x, y, z, typeId) {
        let index = y << 8 | z << 4 | x;
        this.blocks[index] = typeId;
    }

    queueForRebuild() {
        this.dirty = true;
    }
}