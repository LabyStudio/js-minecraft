window.World = class {

    static TOTAL_HEIGHT = ChunkSection.SIZE * 16 - 1;

    constructor() {
        this.group = new THREE.Object3D();
        this.group.matrixAutoUpdate = false;
        this.chunks = [];

        // Load world
        this.generator = new WorldGenerator(this, Date.now() % 100000);
    }

    loadChunk(chunk) {
        // Load chunk
        chunk.load();

        // Generate new chunk
        this.generator.generateChunk(chunk);

        // Populate chunk
        this.generator.populateChunk(chunk.x, chunk.z);
    }

    getChunkAtBlock(x, y, z) {
        let chunk = this.getChunkAt(x >> 4, z >> 4);
        return y < 0 || y > World.TOTAL_HEIGHT ? null : chunk.getSection(y >> 4);
    }

    getCollisionBoxes(region) {
        let boundingBoxList = [];

        let minX = MathHelper.floor_double(region.minX);
        let maxX = MathHelper.floor_double(region.maxX + 1.0);
        let minY = MathHelper.floor_double(region.minY);
        let maxY = MathHelper.floor_double(region.maxY + 1.0);
        let minZ = MathHelper.floor_double(region.minZ);
        let maxZ = MathHelper.floor_double(region.maxZ + 1.0);

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

        this.onBlockChanged(x, y, z);
    }

    getBlockAt(x, y, z) {
        let chunkSection = this.getChunkAtBlock(x, y, z);
        return chunkSection == null ? 0 : chunkSection.getBlockAt(x & 15, y & 15, z & 15);
    }

    getChunkSectionAt(chunkX, layerY, chunkZ) {
        return this.getChunkAt(chunkX, chunkZ).getSection(layerY);
    }

    getChunkAt(x, z) {
        let index = x + (z << 16);
        let chunk = this.chunks[index];
        if (typeof chunk === 'undefined') {
            this.chunks[index] = chunk = new Chunk(this, x, z);
            this.group.add(chunk.group);
        }
        return chunk;
    }

    getHighestBlockYAt(x, z) {
        for (let y = World.TOTAL_HEIGHT; y > 0; y--) {
            if (this.isSolidBlockAt(x, y, z)) {
                return y;
            }
        }
        return 0;
    }

    onBlockChanged(x, y, z) {
        this.queueForRebuildInRegion(x - 1, y - 1, z - 1, x + 1, y + 1, z + 1);
    }

    queueForRebuildInRegion(minX, minY, minZ, maxX, maxY, maxZ) {
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
                    this.getChunkSectionAt(x, y, z).queueForRebuild();
                }
            }
        }
    }

    rayTraceBlocks(from, to) {
        let toX = MathHelper.floor_double(to.x);
        let toY = MathHelper.floor_double(to.y);
        let toZ = MathHelper.floor_double(to.z);

        let x = MathHelper.floor_double(from.x);
        let y = MathHelper.floor_double(from.y);
        let z = MathHelper.floor_double(from.z);

        let blockId = this.getBlockAt(x, y, z);
        let block = Block.getById(blockId);
        let hit = block == null ? null : block.collisionRayTrace(x, y, z, from, to);

        if (hit != null) {
            return hit;
        }

        let lastHit = null;

        let counter = 200;
        while (counter-- >= 0) {
            if (x === toX && y === toY && z === toZ) {
                return lastHit;
            }

            let hitX = true;
            let hitY = true;
            let hitZ = true;

            let nearestX1 = 999.0;
            let nearestY1 = 999.0;
            let nearestZ1 = 999.0;

            if (toX > x) {
                nearestX1 = x + 1.0;
            } else if (toX < x) {
                nearestX1 = x;
            } else {
                hitX = false;
            }

            if (toY > y) {
                nearestY1 = y + 1.0;
            } else if (toY < y) {
                nearestY1 = y;
            } else {
                hitY = false;
            }

            if (toZ > z) {
                nearestZ1 = z + 1.0;
            } else if (toZ < z) {
                nearestZ1 = z;
            } else {
                hitZ = false;
            }

            let nearestX = 999.0;
            let nearestY = 999.0;
            let nearestZ = 999.0;

            let diffX = to.x - from.x;
            let diffY = to.y - from.y;
            let diffZ = to.z - from.z;

            if (hitX) {
                nearestX = (nearestX1 - from.x) / diffX;
            }
            if (hitY) {
                nearestY = (nearestY1 - from.y) / diffY;
            }
            if (hitZ) {
                nearestZ = (nearestZ1 - from.z) / diffZ;
            }

            if (nearestX === -0.0) {
                nearestX = -1.0E-4;
            }
            if (nearestY === -0.0) {
                nearestY = -1.0E-4;
            }
            if (nearestZ === -0.0) {
                nearestZ = -1.0E-4;
            }

            let face;
            if (nearestX < nearestY && nearestX < nearestZ) {
                face = toX > x ? EnumBlockFace.WEST : EnumBlockFace.EAST;
                from = new Vector3(nearestX1, from.y + diffY * nearestX, from.z + diffZ * nearestX);
            } else if (nearestY < nearestZ) {
                face = toY > y ? EnumBlockFace.BOTTOM : EnumBlockFace.TOP;
                from = new Vector3(from.x + diffX * nearestY, nearestY1, from.z + diffZ * nearestY);
            } else {
                face = toZ > z ? EnumBlockFace.NORTH : EnumBlockFace.SOUTH;
                from = new Vector3(from.x + diffX * nearestZ, from.y + diffY * nearestZ, nearestZ1);
            }

            x = MathHelper.floor_double(from.x) - (face === EnumBlockFace.EAST ? 1 : 0);
            y = MathHelper.floor_double(from.y) - (face === EnumBlockFace.TOP ? 1 : 0);
            z = MathHelper.floor_double(from.z) - (face === EnumBlockFace.SOUTH ? 1 : 0);

            let blockId = this.getBlockAt(x, y, z);
            let block = Block.getById(blockId);
            let hit = block == null ? null : block.collisionRayTrace(x, y, z, from, to);
            if (hit != null) {
                return hit;
            }
        }

        return lastHit;

    }

}