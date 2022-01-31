window.World = class {

    static TOTAL_HEIGHT = ChunkSection.SIZE * 16 - 1;

    constructor() {
        this.group = new THREE.Object3D();
        this.chunks = [];

        // Debug world
        for (let x = -16; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                for (let z = -16; z < 16; z++) {
                    this.setBlockAt(x, y, z, y === 15 ? 2 : 3);
                }
            }
        }
        this.setBlockAt(0, 16, -2, 17);
    }

    getChunkAtBlock(x, y, z) {
        let chunk = this.getChunkAt(x >> 4, z >> 4);
        return y < 0 || y > World.TOTAL_HEIGHT ? null : chunk.getSection(y >> 4);
    }

    getCollisionBoxes(aabb) {
        let boundingBoxList = [];

        let minX = MathHelper.floor_double(aabb.minX);
        let maxX = MathHelper.floor_double(aabb.maxX + 1.0);
        let minY = MathHelper.floor_double(aabb.minY);
        let maxY = MathHelper.floor_double(aabb.maxY + 1.0);
        let minZ = MathHelper.floor_double(aabb.minZ);
        let maxZ = MathHelper.floor_double(aabb.maxZ + 1.0);

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
        return typeId !== 0 && Block.getById(typeId).isSolid();
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
            chunk = new Chunk(this, x, z);
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