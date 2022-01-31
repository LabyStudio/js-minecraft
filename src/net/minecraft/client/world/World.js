window.World = class {

    static get TOTAL_HEIGHT() {
        return ChunkSection.SIZE * 16 - 1;
    }

    constructor() {
        this.group = new THREE.Object3D();
        this.chunks = [];

        for (let x = -16; x < 16; x++) {
            for (let z = -16; z < 16; z++) {
                this.setBlockAt(x, 0, z, 1);
            }
        }
    }

    getChunkAtBlock(x, y, z) {
        let chunk = this.getChunkAt(x >> 4, z >> 4);
        return y < 0 || y > World.TOTAL_HEIGHT ? null : chunk.getSection(y >> 4);
    }

    getCollisionBoxes(aabb) {
        let boundingBoxList = [];

        let minX = Math.floor(aabb.minX) - 1;
        let maxX = Math.ceil(aabb.maxX) + 1;
        let minY = Math.floor(aabb.minY) - 1;
        let maxY = Math.ceil(aabb.maxY) + 1;
        let minZ = Math.floor(aabb.minZ) - 1;
        let maxZ = Math.ceil(aabb.maxZ) + 1;

        for (let x = minX; x < maxX; x++) {
            for (let y = minY; y < maxY; y++) {
                for (let z = minZ; z < maxZ; z++) {
                    if (this.isSolidBlockAt(x, y, z)) {
                        boundingBoxList.push(new BoundingBox(x, y, z, x + 1, y + 1, z + 1));
                    }
                }
            }
        }
        return boundingBoxList;
    }

    isSolidBlockAt(x, y, z) {
        let typeId = this.getBlockAt(x, y, z);
        return typeId !== 0; /* && Block.getById(typeId).isSolid();*/
    }

    setBlockAt(x, y, z, type) {
        let chunkSection = this.getChunkAtBlock(x, y, z);
        if (chunkSection != null) {
            chunkSection.setBlockAt(x & 15, y & 15, z & 15, type);
        }

        this.blockChanged(x, y, z);
    }


    getBlockAt(x, y, z) {
        let chunkSection = this.getChunkAtBlock(x, y, z);
        return chunkSection == null ? 0 : chunkSection.getBlockAt(x & 15, y & 15, z & 15);
    }

    getChunkAt(x, z) {
        let zArray = this.chunks[x];
        if (typeof zArray === 'undefined') {
            zArray = this.chunks[x] = [];
        }

        let chunk = zArray[z];
        if (typeof chunk === 'undefined') {
            chunk = new Chunk(x, z);
            this.chunks[x][z] = chunk;
            this.group.add(chunk.group);
        }
        return chunk;
    }

    blockChanged(x, y, z) {
        this.setDirty(x - 1, y - 1, z - 1, x + 1, y + 1, z + 1);
    }

    setDirty(minX, minY, minZ, maxX, maxY, maxZ) {
        // To chunk coordinates
        minX = minX >> 4;
        maxX = maxX >> 4;
        minY = minY >> 4;
        maxY = maxY >> 4;
        minZ = minZ >> 4;
        maxZ = maxZ >> 4;

        // Minimum and maximum y
        minY = Math.max(0, minY);
        maxY = Math.min(15, maxY);

        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                for (let z = minZ; z <= maxZ; z++) {
                    this.getChunkAt(x, y, z).queueForRebuild();
                }
            }
        }
    }

}