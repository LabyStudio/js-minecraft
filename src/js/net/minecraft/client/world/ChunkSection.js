import EnumSkyBlock from "../../util/EnumSkyBlock.js";
import Block from "./block/Block.js";

export default class ChunkSection {

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
        this.isModified = false;

        this.blocks = [];
        this.blocksData = [];
        this.blockLight = [];
        this.skyLight = [];

        // Fill chunk with air and light
        for (let tX = 0; tX < ChunkSection.SIZE; tX++) {
            for (let tY = 0; tY < ChunkSection.SIZE; tY++) {
                for (let tZ = 0; tZ < ChunkSection.SIZE; tZ++) {
                    let index = tY << 8 | tZ << 4 | tX;
                    this.blocks[index] = 0;
                    this.blocksData[index] = 0;
                    this.blockLight[index] = 0;
                    this.skyLight[index] = 0;
                }
            }
        }
    }

    render() {

    }

    rebuild(renderer) {
        this.isModified = false;
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
                        renderer.blockRenderer.renderBlock(this.world, block, absoluteX, absoluteY, absoluteZ);
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

    getBlockDataAt(x, y, z) {
        let index = y << 8 | z << 4 | x;
        return this.blocksData[index];
    }

    setBlockAt(x, y, z, typeId) {
        let index = y << 8 | z << 4 | x;
        this.blocks[index] = typeId;

        this.isModified = true;
    }

    setBlockDataAt(x, y, z, data) {
        let index = y << 8 | z << 4 | x;
        this.blocksData[index] = data;

        this.isModified = true;
    }

    setLightAt(sourceType, x, y, z, lightLevel) {
        let index = y << 8 | z << 4 | x;

        if (sourceType === EnumSkyBlock.SKY) {
            this.skyLight[index] = lightLevel;
        }
        if (sourceType === EnumSkyBlock.BLOCK) {
            this.blockLight[index] = lightLevel;
        }

        this.isModified = true;
    }

    getTotalLightAt(x, y, z) {
        let index = y << 8 | z << 4 | x;
        let skyLight = this.skyLight[index] - this.world.skylightSubtracted;
        let blockLight = this.blockLight[index];
        if (blockLight > skyLight) {
            skyLight = blockLight;
        }
        return skyLight;
    }

    getLightAt(sourceType, x, y, z) {
        let index = y << 8 | z << 4 | x;
        if (sourceType === EnumSkyBlock.SKY) {
            return this.skyLight[index];
        }
        if (sourceType === EnumSkyBlock.BLOCK) {
            return this.blockLight[index];
        }
        return 0;
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
}