import EnumSkyBlock from "../../util/EnumSkyBlock.js";
import Block from "./block/Block.js";
import World from "./World.js";
import ChunkSection from "./ChunkSection.js";
import * as THREE from "../../../../../../libraries/three.module.js";

export default class Chunk {

    static SECTION_AMOUNT = 16;

    constructor(world, x, z) {
        this.world = world;
        this.x = x;
        this.z = z;

        this.group = new THREE.Object3D();
        this.group.matrixAutoUpdate = false;
        this.group.chunkX = x;
        this.group.chunkZ = z;

        this.loaded = false;
        this.isTerrainPopulated = false;

        // Initialize sections
        this.sections = [];
        for (let y = 0; y < Chunk.SECTION_AMOUNT; y++) {
            let section = new ChunkSection(world, this, x, y, z);

            this.sections[y] = section;
            this.group.add(section.group);
        }

        // Create height map
        this.heightMap = [];
    }

    generateSkylightMap() {
        // Calculate height map
        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {
                this.setHeightAt(x, z, 0);
                this.updateHeightMap(x, World.TOTAL_HEIGHT, z);
            }
        }

        // Update light of neighbor blocks
        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {
                this.notifyNeighbors(x, z);
            }
        }

        // Rebuild all sections
        this.setModifiedAllSections();
    }

    generateBlockLightMap() {
        let targetY = 32;
        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {
                for (let y = 0; y < World.TOTAL_HEIGHT; y++) {
                    let section = this.getSection(y >> 4);

                    let typeId = section.getBlockAt(x, y & 15, z);
                    let block = Block.getById(typeId);
                    let blockLight = typeId === 0 ? 0 : block.getLightValue();

                    if (blockLight > 0) {
                        section.setLightAt(EnumSkyBlock.BLOCK, x, y & 15, z, blockLight);
                    }
                }

                let level = 15;
                for (let y = targetY - 2; y < 128 && level > 0;) {
                    y++;

                    let section = this.getSection(y >> 4);

                    let typeId = section.getBlockAt(x, y & 15, z);
                    let block = Block.getById(typeId);

                    let opacity = typeId === 0 ? 0 : block.getOpacity();
                    let blockLight = typeId === 0 ? 0 : block.getLightValue();

                    if (opacity === 0) {
                        opacity = 1;
                    }

                    level -= opacity;

                    if (blockLight > level) {
                        level = blockLight;
                    }

                    if (level < 0) {
                        level = 0;
                    }

                    section.setLightAt(EnumSkyBlock.BLOCK, x, y & 15, z, blockLight);
                }
            }
        }

        this.world.updateLight(EnumSkyBlock.BLOCK,
            this.x * 16, targetY - 1, this.z * 16,
            this.x * 16 + 16, targetY + 1, this.z * 16 + 16
        );
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
        let currentHighestY = this.getHeightAt(relX, relZ);
        let highestY = currentHighestY;
        if (y > currentHighestY) {
            highestY = y;
        }

        highestY = this.calculateHeightAt(relX, relZ, highestY);

        if (highestY === currentHighestY) {
            return;
        }

        this.setHeightAt(relX, relZ, highestY);

        let x = this.x * 16 + relX;
        let z = this.z * 16 + relZ;

        if (highestY < currentHighestY) {
            for (let hy = highestY; hy < currentHighestY; hy++) {
                this.setLightAt(EnumSkyBlock.SKY, relX, hy, relZ, 15);
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

            let typeId = this.getBlockID(relX, highestY, relZ);
            let block = Block.getById(typeId);

            let opacity = Math.floor(typeId === 0 ? 0 : block.getOpacity() * 255);
            if (opacity === 0) {
                opacity = 1;
            }
            lightLevel -= opacity;
            if (lightLevel < 0) {
                lightLevel = 0;
            }

            this.setLightAt(EnumSkyBlock.SKY, relX, highestY, relZ, lightLevel);
        }

        highestY = this.calculateHeightAt(relX, relZ, highestY);

        if (highestY !== prevHeight) {
            this.world.updateLight(EnumSkyBlock.SKY, x - 1, highestY, z - 1, x + 1, prevHeight, z + 1);
        }
        this.setModifiedAllSections();
    }

    calculateHeightAt(x, z, startY) {
        let y = startY;
        while (y > 0) {
            let typeId = this.getBlockAt(x, y - 1, z);
            let block = Block.getById(typeId);
            let opacity = typeId === 0 || block === null ? 0 : block.getOpacity();

            if (opacity !== 0) {
                break;
            }
            y--;
        }
        return y;
    }

    updateHeightMapAt(x, z) {
        let y = this.calculateHeightAt(x, z, World.TOTAL_HEIGHT);
        this.setHeightAt(x, z, y);
    }

    setHeightAt(x, z, height) {
        this.heightMap[z << 4 | x] = height;
    }

    /**
     * Is the highest solid block or above
     */
    isHighestBlock(x, y, z) {
        return y >= this.getHighestBlockAt(x, z);
    }

    /**
     * Is above the highest solid block
     */
    isAboveGround(x, y, z) {
        return y >= this.getHeightAt(x, z);
    }

    /**
     * Get the first non-solid block
     */
    getHeightAt(x, z) {
        return this.heightMap[z << 4 | x];
    }

    /**
     * Get the highest solid block
     */
    getHighestBlockAt(x, z) {
        return this.getHeightAt(x, z) - 1;
    }

    setLightAt(sourceType, x, y, z, level) {
        let section = this.getSection(y >> 4);
        section.setLightAt(sourceType, x, y & 15, z, level);
    }

    setBlockDataAt(x, y, z, data) {
        this.setBlockAt(x, y, z, this.getBlockAt(x, y, z), data);
    }

    setBlockAt(x, y, z, typeId, data = 0) {
        if (y < 0 || y >= World.TOTAL_HEIGHT) {
            return;
        }

        let section = this.getSection(y >> 4);
        let yInSection = y & 15;

        let height = this.getHeightAt(x, z);
        let prevTypeId = section.getBlockAt(x, yInSection, z);
        let prevData = section.getBlockDataAt(x, yInSection, z);

        // Check if block type has changed
        if (prevTypeId === typeId && prevData === data) {
            return false;
        }

        // Update block type and data
        section.setBlockAt(x, yInSection, z, typeId);
        section.setBlockDataAt(x, yInSection, z, data);

        if (!this.loaded) {
            return;
        }

        // Update height map
        let block = Block.getById(typeId);
        if (typeId !== 0 && block !== null && block.isSolid()) {
            if (y >= height) {
                this.updateHeightMap(x, y + 1, z);
            }
        } else if (y === height - 1) {
            this.updateHeightMap(x, y, z);
        }

        let totalX = this.x * 16 + x;
        let totalZ = this.z * 16 + z;

        // Update light
        this.world.updateLight(EnumSkyBlock.SKY, totalX, y, totalZ, totalX, y, totalZ);
        this.world.updateLight(EnumSkyBlock.BLOCK, totalX, y, totalZ, totalX, y, totalZ);

        // Notify surrounding blocks
        this.notifyNeighbors(x, z);

        // Handle block abilities
        if (typeId !== 0 && block !== null) {
            block.onBlockAdded(this.world, totalX, y, totalZ);
        }

        return true;
    }

    fillChunk(data, mask, fullChunk) {
        let i = 0;
        for (let layer = 0; layer < Chunk.SECTION_AMOUNT; layer++) {
            if ((mask & 1 << layer) !== 0) {
                let section = this.getSection(layer);

                for (let k = 0; k < ChunkSection.SIZE * ChunkSection.SIZE * ChunkSection.SIZE; k++) {
                    let x = k & 15;
                    let z = (k >> 4) & 15;
                    let y = (k >> 8) & 15;

                    let value = (((data[i] & 0xFF) | (data[i + 1] & 0xFF) << 8));
                    let typeId = value >> 4;
                    let meta = value & 0xF; // TODO handle meta of block

                    // TODO support more blocks
                    if (typeId !== 0 && Block.getById(typeId) === null) {
                        typeId = 1;
                    }

                    section.setBlockAt(x, y, z, typeId);

                    i += 2;
                }
            }
        }
    }

    getBlockID(x, y, z) {
        return this.getBlockAt(x, y, z);
    }

    getBlockAt(x, y, z) {
        return this.getSection(y >> 4).getBlockAt(x, y & 15, z);
    }

    getBlockDataAt(x, y, z) {
        return this.getSection(y >> 4).getBlockDataAt(x, y & 15, z);
    }

    getSection(y) {
        return this.sections[y];
    }

    rebuild(renderer) {
        for (let y = 0; y < Chunk.SECTION_AMOUNT; y++) {
            this.sections[y].rebuild(renderer);
        }
    }

    isLoaded() {
        return this.loaded;
    }

    unload() {
        this.loaded = false;
    }

    setModifiedAllSections() {
        for (let y = 0; y < Chunk.SECTION_AMOUNT; y++) {
            this.sections[y].isModified = true;
        }
    }
}