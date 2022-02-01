window.ChunkSection = class {

    static SIZE = 16;

    constructor(world, chunk, x, y, z) {
        this.world = world;
        this.chunk = chunk;
        this.x = x;
        this.y = y;
        this.z = z;

        this.boundingBox = new THREE.Box3();
        this.boundingBox.min.x = x * ChunkSection.SIZE;
        this.boundingBox.min.y = y * ChunkSection.SIZE;
        this.boundingBox.min.z = z * ChunkSection.SIZE;
        this.boundingBox.max.x = x * ChunkSection.SIZE + ChunkSection.SIZE;
        this.boundingBox.max.y = y * ChunkSection.SIZE + ChunkSection.SIZE;
        this.boundingBox.max.z = z * ChunkSection.SIZE + ChunkSection.SIZE;

        this.group = new THREE.Object3D();
        this.group.matrixAutoUpdate = false;
        this.queuedForRebuild = true;

        this.blocks = [];
        for (let x = 0; x < ChunkSection.SIZE; x++) {
            for (let y = 0; y < ChunkSection.SIZE; y++) {
                for (let z = 0; z < ChunkSection.SIZE; z++) {
                    this.setBlockAt(x, y, z, 0);
                }
            }
        }
    }

    render() {

    }

    rebuild(renderer) {
        this.queuedForRebuild = false;
        this.group.clear();

        // Start drawing chunk section
        let tessellator = renderer.blockRenderer.tessellator;
        tessellator.startDrawing();

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

        // Draw chunk section
        tessellator.draw(this.group);
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
        this.queuedForRebuild = true;
    }

    isQueuedForRebuild() {
        return this.queuedForRebuild;
    }
}