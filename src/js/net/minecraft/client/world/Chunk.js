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

    generateSkylightMap() {
        let highest = World.TOTAL_HEIGHT;
        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {
                this.heightMap[z << 4 | x] = -1;

                this.updateHeightMap(x, World.TOTAL_HEIGHT, z);

                if ((this.heightMap[z << 4 | x] & 0xff) < highest) {
                    highest = this.heightMap[z << 4 | x] & 0xff;
                }
            }
        }

        this.highestY = highest;
        for (let k = 0; k < 16; k++) {
            for (let i1 = 0; i1 < 16; i1++) {
                this.notifyNeighbors(k, i1);
            }

        }

        this.setModifiedAllSections();
    }

    updateBlockLight() {
        this.setModifiedAllSections();
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
        this.setModifiedAllSections();
    }

    updateHeightMap(relX, y, relZ) {
        let currentHighestY = this.heightMap[relZ << 4 | relX] & 0xff;
        let highestY = currentHighestY;
        if (y > currentHighestY) {
            highestY = y;
        }
        while (highestY > 0 && Block.lightOpacity[this.getBlockAt(relX, highestY, relZ)] === 0) {
            highestY--;
        }
        if (highestY === currentHighestY) {
            return;
        }
        //this.world.heightLevelChanged(relX, relZ, highestY, currentHighestY);
        this.heightMap[relZ << 4 | relX] = highestY;
        if (highestY < this.highestY) {
            this.highestY = highestY;
        } else {
            let highest = 127;
            for (let cx = 0; cx < 16; cx++) {
                for (let cz = 0; cz < 16; cz++) {
                    if ((this.heightMap[cz << 4 | cx] & 0xff) < highest) {
                        highest = this.heightMap[cz << 4 | cx] & 0xff;
                    }
                }

            }

            this.highestY = highest;
        }

        let x = this.x * 16 + relX;
        let z = this.z * 16 + relZ;

        if (highestY < currentHighestY) {
            for (let l2 = highestY; l2 < currentHighestY; l2++) {
                this.setLightAt(EnumSkyBlock.SKY, relX, l2, relZ, 15);
            }

        } else {
            this.world.updateLight(EnumSkyBlock.SKY, x, currentHighestY, z, x, highestY, z);
            for (let hy = currentHighestY; hy < highestY; hy++) {
                this.setLightAt(EnumSkyBlock.SKY, relX, hy, relZ, 0);
            }

        }
        let lightLevel = 15;
        let prevHeight = highestY;
        while (highestY > 0 && lightLevel > 0) {
            highestY--;
            let opacity = Block.lightOpacity[this.getBlockID(relX, highestY, relZ)];
            if (opacity === 0) {
                opacity = 1;
            }
            lightLevel -= opacity;
            if (lightLevel < 0) {
                lightLevel = 0;
            }
            this.setLightAt(EnumSkyBlock.SKY, relX, highestY, relZ, lightLevel);
        }
        for (; highestY > 0 && Block.lightOpacity[this.getBlockID(relX, highestY - 1, relZ)] === 0; highestY--) {
        }
        if (highestY !== prevHeight) {
            this.world.updateLight(EnumSkyBlock.SKY, x - 1, highestY, z - 1, x + 1, prevHeight, z + 1);
        }
        this.setModifiedAllSections();
    }

    setLightAt(sourceType, x, y, z, level) {
        this.getSection(y >> 4).setLightAt(sourceType, x, y & 15, z, level);
    }

    setBlockAt(x, y, z, typeId) {
        let byte0 = typeId;
        let height = this.heightMap[z << 4 | x] & 0xff;

        let prevTypeId = this.getBlockAt(x, y, z);
        if (prevTypeId === typeId) {
            return false;
        }

        let totalX = this.x * 16 + x;
        let totalZ = this.z * 16 + z;

        this.getSection(y >> 4).setBlockAt(x, y & 15, z, byte0);

        if (!this.loaded) {
            return;
        }

        //if (k1 !== 0 && !this.worldObj.multiplayerWorld) {
        //Block.blocksList[k1].onBlockRemoval(this.world, l1, j, i2);
        //}
        //this.data.setNibble(i, j, k, i1);
        //if (!this.worldObj.worldProvider.field_6478_e) {

        if (Block.lightOpacity[byte0] !== 0) {
            if (y >= height) {
                this.updateHeightMap(x, y + 1, z);
            }
        } else if (y === height - 1) {
            this.updateHeightMap(x, y, z);
        }

        this.world.updateLight(EnumSkyBlock.SKY, totalX, y, totalZ, totalX, y, totalZ);
        //}

        this.world.updateLight(EnumSkyBlock.BLOCK, totalX, y, totalZ, totalX, y, totalZ);
        this.notifyNeighbors(x, z);

        if (typeId !== 0) {
            //Block.blocksList[l].onBlockAdded(this.worldObj, l1, j, i2);
        }

        //this.data.setNibble(i, j, k, i1);

        this.setModifiedAllSections();
        return true;
    }

    getBlockID(x, y, z) {
        return this.getBlockAt(x, y, z);
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

    getSection(y) {
        return this.sections[y];
    }

    rebuild(renderer) {
        for (let y = 0; y < this.sections.length; y++) {
            this.sections[y].rebuild(renderer);
        }
    }

    isLoaded() {
        return this.loaded;
    }

    setModifiedAllSections() {
        for (let y = 0; y < this.sections.length; y++) {
            this.sections[y].isModified = true;
        }
    }
}