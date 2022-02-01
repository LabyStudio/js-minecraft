window.Chunk = class {

    constructor(world, x, z) {
        this.world = world;
        this.x = x;
        this.z = z;

        this.group = new THREE.Object3D();
        this.group.matrixAutoUpdate = false;

        this.loaded = false;

        // Initialize sections
        this.sections = [];
        for (let y = 0; y < 16; y++) {
            let section = new ChunkSection(world, this, x, y, z);

            this.sections[y] = section;
            this.group.add(section.group);
        }

        // Create height map
        this.heightMap = [];
    }

    setBlockAt(x, y, z, typeId) {
        let section = this.getSection(y >> 4);
        let prevTypeId = section.getBlockAt(x, y & 15, z);
        if (prevTypeId === typeId) {
            return;
        }

        // Update block type id
        section.setBlockAt(x, y & 15, z, typeId);

        let block = Block.getById(typeId);
        let heightLevel = this.heightMap[z << 4 | x] & 0xff;

        if (typeId !== 0 && block.isSolid()) {
            if (y >= heightLevel) {
                // Update height map if it is the new highest block now
                this.updateHeightMap(x, y + 1, z);
            }
        } else if (y === heightLevel - 1) {
            // Update height map if it is below the highest block because it could block the sun
            this.updateHeightMap(x, y, z);
        }

        // Update light at block
        //this.world.updateLight(EnumSkyBlock.SKY, x, y, z, x, y, z);
        //this.world.updateLight(EnumSkyBlock.BLOCK, x, y, z, x, y, z);

        // Notify neighbors
        //this.notifyNeighbors(x, z);
    }

    notifyNeighbors(x, z) {
        let height = this.getHeightAt(x, z);
        let totalX = this.x * 16 + x;
        let totalZ = this.z * 16 + z;

        this.updateSkyLight(totalX - 1, totalZ, height);
        this.updateSkyLight(totalX + 1, totalZ, height);
        this.updateSkyLight(totalX, totalZ - 1, height);
        this.updateSkyLight(totalX, totalZ + 1, height);
    }

    updateSkyLight(x, z, y) {
        let height = this.world.getHeightAt(x, z);
        if (height > y) {
            this.world.updateLight(EnumSkyBlock.SKY, x, y, z, x, height, z);
        } else if (height < y) {
            this.world.updateLight(EnumSkyBlock.SKY, x, height, z, x, y, z);
        }
    }

    getBlockAt(x, y, z) {
        return this.getSection(y >> 4).getBlockAt(x, y & 15, z);
    }

    isHighestBlock(x, y, z) {
        return y >= (this.heightMap[z << 4 | x] & 0xff);
    }

    getHeightAt(x, z) {
        return this.heightMap[z << 4 | x] & 0xff;
    }

    updateHeightMap(x, y, z) {
        let currentHighestY = this.heightMap[z << 4 | x] & 0xff;
        let highestY = currentHighestY;
        if (y > currentHighestY) {
            highestY = y;
        }

        // Find new highest blocks
        while (highestY > 0) {
            let typeId = this.getBlockAt(x, highestY, z);
            let block = Block.getById(typeId);
            if (typeId !== 0 && block.isSolid()) {
                break;
            }
            highestY--;
        }

        // Check if highest block changed
        if (highestY === currentHighestY) {
            return;
        }

        // Save in height map
        this.heightMap[z << 4 | x] = highestY;


        let totalX = this.x * 16 + x;
        let totalZ = this.z * 16 + z;

        if (highestY < currentHighestY) {
            for (let hy = highestY; hy < currentHighestY; hy++) {
                this.getSection(hy >> 4).setLightAt(EnumSkyBlock.SKY, x, hy, z, 15);
            }
        } else {
            this.world.updateLight(EnumSkyBlock.SKY, totalX, currentHighestY, totalZ, totalX, highestY, totalZ);

            for (let hy = currentHighestY; hy < highestY; hy++) {
                this.getSection(hy >> 4).setLightAt(EnumSkyBlock.SKY, x, hy, z, 0);
            }

        }

        let lightLevel = 15;
        let currentY = highestY;
        while (currentY > 0 && lightLevel > 0) {
            currentY--;

            let typeId = this.getBlockAt(x, currentY, z);
            let block = Block.getById(typeId);

            // Reduce light level by opacity
            if (typeId !== 0) {
                lightLevel *= (1 - block.getOpacity());
            }

            // Min light level
            if (lightLevel < 0) {
                lightLevel = 0;
            }

            // Update light level
            this.getSection(currentY >> 4).setLightAt(EnumSkyBlock.SKY, x & 15, currentY, z & 15, lightLevel);
        }

        if (currentY !== highestY) {
            this.world.updateLight(EnumSkyBlock.SKY, x - 1, currentY, z - 1, x + 1, currentY, z + 1);
        }
    }

    getSection(y) {
        return this.sections[y];
    }

    rebuild(renderer) {
        for (let y = 0; y < this.sections.length; y++) {
            this.sections[y].rebuild(renderer);
        }
    }

    queueForRebuild() {
        for (let y = 0; y < this.sections.length; y++) {
            this.sections[y].queueForRebuild();
        }
    }

    load() {
        this.loaded = true;
    }

    isLoaded() {
        return this.loaded;
    }

}