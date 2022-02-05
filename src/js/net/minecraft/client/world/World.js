window.World = class {

    static TOTAL_HEIGHT = ChunkSection.SIZE * 8 - 1; // ChunkSection.SIZE * 16 - 1;

    constructor(minecraft) {
        this.minecraft = minecraft;

        this.group = new THREE.Object3D();
        this.group.matrixAutoUpdate = false;

        this.chunks = new Map();
        this.lightUpdateQueue = [];

        // Load world
        this.generator = new WorldGenerator(this, Date.now() % 100000);

        // Update lights async
        let scope = this;
        setInterval(function () {
            let i = scope.minecraft.loadingScreen === null ? 1000 : 100000;
            while (scope.lightUpdateQueue.length >= 10 && i > 0) {
                i--;
                scope.lightUpdateQueue.shift().updateBlockLightning(scope);
            }
        }, 0);
    }

    onTick() {
        let player = this.minecraft.player;
        let cameraChunkX = Math.floor(player.x >> 4);
        let cameraChunkZ = Math.floor(player.z >> 4);

        // Update render order of chunks
        this.group.children.sort((a, b) => {
            let distance1 = Math.floor(Math.pow(a.chunkX - cameraChunkX, 2) + Math.pow(a.chunkZ - cameraChunkZ, 2));
            let distance2 = Math.floor(Math.pow(b.chunkX - cameraChunkX, 2) + Math.pow(b.chunkZ - cameraChunkZ, 2));
            return distance2 - distance1;
        });
    }

    getChunkAt(x, z) {
        let index = x + (z << 16);
        let chunk = this.chunks.get(index);
        if (typeof chunk === 'undefined') {
            chunk = new Chunk(this, x, z);

            // Generate new chunk
            this.generator.generateChunk(chunk);

            // Init
            chunk.generateSkylightMap();

            // Register
            chunk.loaded = true;
            this.chunks.set(index, chunk);
            this.group.add(chunk.group);

            // Populate chunk
            this.generator.populateChunk(chunk.x, chunk.z);
        }
        return chunk;
    }

    getChunkAtBlock(x, y, z) {
        if (!this.blockExists(x, y, z)) {
            return null;
        }
        return this.getChunkAt(x >> 4, z >> 4).getSection(y >> 4);
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

    updateLights() {
        let scope = this;

        if (this.lightUpdateQueue.length < 10) {
            // Update lights in queue
            let i = 10;
            while (scope.lightUpdateQueue.length > 0) {
                if (i <= 0) {
                    return true;
                }

                let meta = scope.lightUpdateQueue.shift();
                meta.updateBlockLightning(scope);
                i--;
            }
        }
        return false;
    }

    updateLight(sourceType, x1, y1, z1, x2, y2, z2, notifyNeighbor = true) {
        let centerX = (x2 + x1) / 2;
        let centerZ = (z2 + z1) / 2;

        if (!this.blockExists(centerX, 64, centerZ)) {
            return;
        }

        let size = this.lightUpdateQueue.length;

        if (notifyNeighbor) {
            let max = 4;
            if (max > size) {
                max = size;
            }
            for (let i = 0; i < max; i++) {
                let meta = this.lightUpdateQueue[(this.lightUpdateQueue.length - i - 1)];
                if (meta.type === sourceType && meta.isOutsideOf(x1, y1, z1, x2, y2, z2)) {
                    return;
                }
            }
        }

        // Add light update region to queue
        this.lightUpdateQueue.push(new MetadataChunkBlock(sourceType, x1, y1, z1, x2, y2, z2));

        // Max light updates in queue
        if (this.lightUpdateQueue.length > 100000) {
            this.lightUpdateQueue = [];
        }
    }

    blockExists(x, y, z) {
        if (y < 0 || y >= World.TOTAL_HEIGHT) {
            return false;
        } else {
            return this.chunkExists(x >> 4, z >> 4);
        }
    }

    chunkExists(chunkX, chunkZ) {
        let index = chunkX + (chunkZ << 16);
        let chunk = this.chunks.get(index);
        return typeof chunk !== 'undefined';
    }

    neighborLightPropagationChanged(sourceType, x, y, z, level) {
        if (!this.blockExists(x, y, z)) {
            return;
        }
        if (sourceType === EnumSkyBlock.SKY) {
            if (this.isAboveGround(x, y, z)) {
                level = 15;
            }
        } else if (sourceType === EnumSkyBlock.BLOCK) {
            let i1 = this.getBlockAt(x, y, z);
            if (0 > level) { // TODO
                level = 0;
            }
        }
        if (this.getSavedLightValue(sourceType, x, y, z) !== level) {
            this.updateLight(sourceType, x, y, z, x, y, z);
        }
    }

    /**
     * Get the first non-solid block
     */
    getHeightAt(x, z) {
        if (!this.chunkExists(x >> 4, z >> 4)) {
            return 0;
        }
        return this.getChunkAt(x >> 4, z >> 4).getHeightAt(x & 15, z & 15);
    }

    /**
     * Get the highest solid block
     */
    getHighestBlockAt(x, z) {
        if (!this.chunkExists(x >> 4, z >> 4)) {
            return 0;
        }
        return this.getChunkAt(x >> 4, z >> 4).getHighestBlockAt(x & 15, z & 15);
    }

    /**
     * Is the highest solid block or above
     */
    isHighestBlock(x, y, z) {
        let chunk = this.getChunkAt(x >> 4, z >> 4)
        return chunk.isHighestBlock(x & 15, y, z & 15);
    }

    /**
     * Is above the highest solid block
     */
    isAboveGround(x, y, z) {
        let chunk = this.getChunkAt(x >> 4, z >> 4)
        return chunk.isAboveGround(x & 15, y, z & 15);
    }

    getTotalLightAt(x, y, z) {
        if (!this.blockExists(x, y, z)) {
            return 15;
        }

        let section = this.getChunkSectionAt(x >> 4, y >> 4, z >> 4)
        return section.getTotalLightAt(x & 15, y & 15, z & 15);
    }

    getSavedLightValue(sourceType, x, y, z) {
        if (!this.blockExists(x, y, z)) {
            return 15;
        }

        let section = this.getChunkSectionAt(x >> 4, y >> 4, z >> 4)
        return section.getLightAt(sourceType, x & 15, y & 15, z & 15);
    }

    setLightAt(sourceType, x, y, z, lightLevel) {
        if (!this.chunkExists(x >> 4, z >> 4)) {
            return;
        }

        let section = this.getChunkSectionAt(x >> 4, y >> 4, z >> 4)
        section.setLightAt(sourceType, x & 15, y & 15, z & 15, lightLevel);
    }

    isSolidBlockAt(x, y, z) {
        let typeId = this.getBlockAt(x, y, z);
        return typeId !== 0 && Block.getById(typeId).isSolid();
    }

    isTransparentBlockAt(x, y, z) {
        let typeId = this.getBlockAt(x, y, z);
        return typeId === 0 || Block.getById(typeId).isTransparent();
    }

    setBlockAt(x, y, z, type) {
        let chunk = this.getChunkAt(x >> 4, z >> 4);
        chunk.setBlockAt(x & 15, y, z & 15, type);

        // Rebuild chunk
        this.onBlockChanged(x, y, z);
    }

    getBlockAt(x, y, z) {
        let chunkSection = this.getChunkAtBlock(x, y, z);
        return chunkSection == null ? 0 : chunkSection.getBlockAt(x & 15, y & 15, z & 15);
    }

    getBlockAtFace(x, y, z, face) {
        return this.getBlockAt(x + face.x, y + face.y, z + face.z);
    }

    getChunkSectionAt(chunkX, layerY, chunkZ) {
        return this.getChunkAt(chunkX, chunkZ).getSection(layerY);
    }

    onBlockChanged(x, y, z) {
        this.setModified(x - 1, y - 1, z - 1, x + 1, y + 1, z + 1);
    }

    setModified(minX, minY, minZ, maxX, maxY, maxZ) {
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
                    if (this.chunkExists(x >> 4, z >> 4)) {
                        this.getChunkSectionAt(x, y, z).isModified = true;
                    }
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

        if (block != null && block.canCollide()) {
            let hit = block.collisionRayTrace(x, y, z, from, to);
            if (hit != null) {
                return hit;
            }
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

            if (block != null && block.canCollide()) {
                let hit = block.collisionRayTrace(x, y, z, from, to);
                if (hit != null) {
                    return hit;
                }
            }
        }

        return lastHit;

    }

}