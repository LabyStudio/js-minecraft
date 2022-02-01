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
        this.blockLight = [];

        // Fill chunk with air and light
        for (let lightX = 0; lightX < ChunkSection.SIZE; lightX++) {
            for (let lightY = 0; lightY < ChunkSection.SIZE; lightY++) {
                for (let lightZ = 0; lightZ < ChunkSection.SIZE; lightZ++) {
                    let index = lightY << 8 | lightZ << 4 | lightX;

                    this.blocks[index] = 0;
                    this.blockLight[index] = 15;
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

    setLightAt(x, y, z, lightLevel) {
        let index = y << 8 | z << 4 | x;
        this.blockLight[index] = lightLevel;
    }

    getLightAt(x, y, z) {
        let index = y << 8 | z << 4 | x;
        return this.blockLight[index];
    }

    isEmpty() {
        for (let x = 0; x < ChunkSection.SIZE; x++) {
            for (let y = 0; y < ChunkSection.SIZE; y++) {
                for (let z = 0; z < ChunkSection.SIZE; z++) {
                    let index = y << 8 | z << 4 | x;
                    if (this.blocks[index] !== 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    queueForRebuild() {
        this.queuedForRebuild = true;
    }

    isQueuedForRebuild() {
        return this.queuedForRebuild;
    }
}