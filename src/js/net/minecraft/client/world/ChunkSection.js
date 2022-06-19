import EnumSkyBlock from "../../util/EnumSkyBlock.js";
import Block from "./block/Block.js";
import * as THREE from "../../../../../../libraries/three.module.js";

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
        this.group.position.x = this.x * ChunkSection.SIZE;
        this.group.position.y = this.y * ChunkSection.SIZE;
        this.group.position.z = this.z * ChunkSection.SIZE;
        this.group.updateMatrix();
        this.group.matrixAutoUpdate = false;
        this.isModified = true;

        this.blocks = [];
        this.blocksData = [];
        this.blockLight = [];
        this.skyLight = [];
        this.empty = true;
    }

    render() {

    }

    rebuild(renderer) {
        this.isModified = false;
        this.group.clear();

        let ambientOcclusion = this.world.minecraft.settings.ambientOcclusion;
        let tessellator = renderer.blockRenderer.tessellator;

        // Two render phases for solid and translucent
        for (let i = 0; i < 2; i++) {
            let isTranslucentRenderPhase = i === 1;

            // Start drawing chunk section
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
                            if (block === null || block.isTranslucent() !== isTranslucentRenderPhase) {
                                continue;
                            }

                            renderer.blockRenderer.renderBlock(this.world, block, ambientOcclusion, absoluteX, absoluteY, absoluteZ);
                        }
                    }
                }
            }

            // Draw chunk section
            tessellator.draw(this.group);
        }
    }

    getBlockAt(x, y, z) {
        let index = y << 8 | z << 4 | x;
        return !this.empty && index in this.blocks ? this.blocks[index] : 0;
    }

    getBlockDataAt(x, y, z) {
        let index = y << 8 | z << 4 | x;
        return !this.empty && index in this.blocksData ? this.blocksData[index] : 0;
    }

    setBlockAt(x, y, z, typeId) {
        let index = y << 8 | z << 4 | x;
        this.blocks[index] = typeId;
        this.isModified = true;

        if (this.empty && typeId !== 0) {
            this.empty = false;
        }
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
        let skyLight = (index in this.skyLight ? this.skyLight[index] : (this.empty ? 15 : 14)) - this.world.skylightSubtracted;
        let blockLight = index in this.blockLight ? this.blockLight[index] : 0;
        if (blockLight > skyLight) {
            skyLight = blockLight;
        }
        return skyLight;
    }

    getLightAt(sourceType, x, y, z) {
        let index = y << 8 | z << 4 | x;
        if (sourceType === EnumSkyBlock.SKY) {
            return index in this.skyLight ? this.skyLight[index] : (this.empty ? 15 : 14);
        }
        if (sourceType === EnumSkyBlock.BLOCK) {
            return index in this.blockLight ? this.blockLight[index] : 0;
        }
        return 0;
    }

    isEmpty() {
        return this.empty;
    }
}