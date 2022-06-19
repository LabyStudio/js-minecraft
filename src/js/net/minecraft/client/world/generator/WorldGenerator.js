import NoiseGeneratorOctaves from "./noise/NoiseGeneratorOctaves.js";
import Chunk from "../Chunk.js";
import Primer from "./Primer.js";
import CaveGenerator from "./structure/CaveGenerator.js";
import {BlockRegistry} from "../block/BlockRegistry.js";
import TreeGenerator from "./structure/TreeGenerator.js";
import BigTreeGenerator from "./structure/BigTreeGenerator.js";
import Generator from "./Generator.js";
import ChunkSection from "../ChunkSection.js";

export default class WorldGenerator extends Generator {

    constructor(world, seed) {
        super(world, seed);

        this.caveGenerator = new CaveGenerator(world, seed);

        this.terrainGenerator4 = new NoiseGeneratorOctaves(this.random, 16);
        this.terrainGenerator5 = new NoiseGeneratorOctaves(this.random, 16);
        this.terrainGenerator3 = new NoiseGeneratorOctaves(this.random, 8);

        this.natureGenerator1 = new NoiseGeneratorOctaves(this.random, 4);
        this.natureGenerator2 = new NoiseGeneratorOctaves(this.random, 4);

        this.terrainGenerator1 = new NoiseGeneratorOctaves(this.random, 10);
        this.terrainGenerator2 = new NoiseGeneratorOctaves(this.random, 16);

        this.populationNoiseGenerator = new NoiseGeneratorOctaves(this.random, 8);
    }

    newChunk(world, chunkX, chunkZ) {
        this.random.setSeed(chunkX * 0x4f9939f508 + chunkZ * 0x1ef1565bd5);

        let chunk = new Chunk(world, chunkX, chunkZ);
        let primer = new Primer(chunk);

        this.generateInChunk(chunkX, chunkZ, primer);

        // Init skylight
        chunk.generateSkylightMap();
        chunk.generateBlockLightMap();

        return chunk;
    }

    generateInChunk(chunkX, chunkZ, primer) {
        this.generateTerrain(chunkX, chunkZ, primer);
        this.naturalize(chunkX, chunkZ, primer);

        this.caveGenerator.generateInChunk(chunkX, chunkZ, primer);
    }

    populateChunk(chunkX, chunkZ) {
        // Set seed for chunk
        this.setChunkSeed(chunkX, chunkZ);

        // Access noise data for population
        let absoluteX = chunkX * 16;
        let absoluteY = chunkZ * 16;
        let amount = Math.floor((this.populationNoiseGenerator.perlin(absoluteX * 0.5, absoluteY * 0.5) / 8 + this.random.nextDouble() * 4 + 4) / 3);
        if (amount < 0) {
            amount = 0;
        }
        if (this.random.nextInt(10) === 0) {
            amount++;
        }

        // Tree generator
        let bigTree = this.random.nextInt(10) === 0;
        let treeSeed = this.random.seed;
        let treeGenerator = bigTree ? new BigTreeGenerator(this.world, treeSeed) : new TreeGenerator(this.world, treeSeed);

        // Plant the trees in the chunk
        for (let i = 0; i < amount; i++) {
            let totalX = absoluteX + this.random.nextInt(16) + 8;
            let totalZ = absoluteY + this.random.nextInt(16) + 8;
            let totalY = this.world.getHeightAt(totalX, totalZ);

            // Generate tree at position
            treeGenerator.generateAtBlock(totalX, totalY, totalZ);
        }
    }


    generateTerrain(chunkX, chunkZ, primer) {
        let range = 4;
        let sizeX = range + 1;
        let sizeZ = 17;
        let factor = 1 / 4;

        // Generate terrain noise
        let noise = this.generateTerrainNoise(chunkX * range, 0, chunkZ * range, sizeX, sizeZ, sizeX);

        let isSnowBiome = false;

        for (let indexX = 0; indexX < range; indexX++) {
            for (let indexZ = 0; indexZ < range; indexZ++) {
                for (let indexY = 0; indexY < 16; indexY++) {
                    let sec = 1 / 8;

                    // Terrain base noise values
                    let noise1 = noise[(indexX * sizeX + indexZ) * sizeZ + indexY];
                    let noise2 = noise[(indexX * sizeX + (indexZ + 1)) * sizeZ + indexY];

                    let noise3 = noise[((indexX + 1) * sizeX + indexZ) * sizeZ + indexY];
                    let noise4 = noise[((indexX + 1) * sizeX + (indexZ + 1)) * sizeZ + indexY];

                    // Mutation noise values
                    let mut1 = (noise[(indexX * sizeX + indexZ) * sizeZ + (indexY + 1)] - noise1) * sec;
                    let mut2 = (noise[(indexX * sizeX + (indexZ + 1)) * sizeZ + (indexY + 1)] - noise2) * sec;
                    let mut3 = (noise[((indexX + 1) * sizeX + indexZ) * sizeZ + (indexY + 1)] - noise3) * sec;
                    let mut4 = (noise[((indexX + 1) * sizeX + (indexZ + 1)) * sizeZ + (indexY + 1)] - noise4) * sec;

                    // For each y level of the section
                    for (let y = 0; y < 8; y++) {
                        // Take two noise values for the stone to rise
                        let stoneNoiseAtY1 = noise1;
                        let stoneNoiseAtY2 = noise2;

                        // Calculate difference of the selected noise values and two other noise values
                        let diffNoiseY1 = (noise3 - noise1) * factor;
                        let diffNoiseY2 = (noise4 - noise2) * factor;

                        // For each x and z coordinate of the section
                        for (let x = 0; x < 4; x++) {
                            let stoneNoise = stoneNoiseAtY1;
                            let diffNoiseX = (stoneNoiseAtY2 - stoneNoiseAtY1) * factor;

                            for (let z = 0; z < 4; z++) {
                                let typeId = 0;

                                // Set water if y level is below sea level
                                if (indexY * 8 + y < this.seaLevel) {
                                    if (isSnowBiome && indexY * 8 + y >= this.seaLevel - 1) {
                                        typeId = BlockRegistry.WATER.getId(); // TODO add ice block
                                    } else {
                                        typeId = BlockRegistry.WATER.getId();
                                    }
                                }

                                // Let the terrain rise out of the water
                                if (stoneNoise > 0.0) {
                                    typeId = BlockRegistry.STONE.getId();
                                }

                                //Set target type id
                                primer.set(indexX * 4 + x, indexY * 8 + y, indexZ * 4 + z, typeId);

                                // Increase noise by noise x difference
                                stoneNoise += diffNoiseX;
                            }

                            // Increase noise by noise y differences
                            stoneNoiseAtY1 += diffNoiseY1;
                            stoneNoiseAtY2 += diffNoiseY2;
                        }

                        // Mutate noise values
                        noise1 += mut1;
                        noise2 += mut2;
                        noise3 += mut3;
                        noise4 += mut4;
                    }
                }
            }
        }
    }

    naturalize(chunkX, chunkZ, primer) {
        let strength = 1 / 32;
        let chunkSize = ChunkSection.SIZE;

        // Generate noise for nature painting
        let natureNoise1 = this.natureGenerator1.generateNoiseOctaves(
            chunkX * chunkSize, chunkZ * chunkSize,
            0.0, chunkSize, chunkSize, 1,
            strength, strength, 1.0
        );
        let natureNoise2 = this.natureGenerator1.generateNoiseOctaves(
            chunkZ * chunkSize, 109.0134, chunkX * chunkSize,
            chunkSize, 1, chunkSize,
            strength, 1.0, strength);
        let natureNoise3 = this.natureGenerator2.generateNoiseOctaves(
            chunkX * chunkSize, chunkZ * chunkSize, 0.0,
            chunkSize, chunkSize, 1,
            strength * 2, strength * 2, strength * 2
        );

        // Paint entire chunk with nature blocks
        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {
                // Pull noise values for patches
                let sandPatchNoise = natureNoise1[x + z * 16] + this.random.nextFloat() * 0.2 > 0;
                let gravelPatchNoise = natureNoise2[x + z * 16] + this.random.nextFloat() * 0.2 > 3;
                let stonePatchNoise = (natureNoise3[x + z * 16] / 3 + 3 + this.random.nextFloat() * 0.25);

                let prevStonePatchNoise = -1;

                // Default layer type ids
                let topLayerTypeId = BlockRegistry.GRASS.getId();
                let innerLayerTypeId = BlockRegistry.DIRT.getId();

                // For the entire height of the chunk
                for (let y = 127; y >= 0; y--) {
                    // Set bedrock on floor level
                    if (y <= (this.random.nextInt(6)) - 1 || y === 0) {
                        primer.set(x, y, z, BlockRegistry.BEDROCK.getId());
                        continue;
                    }

                    // Get block type at current position
                    let typeIdAt = primer.get(x, y, z);

                    // Ignore air block
                    if (typeIdAt === 0) {
                        prevStonePatchNoise = -1;
                        continue;
                    }

                    // Check if it's a stone block
                    if (typeIdAt !== BlockRegistry.STONE.getId()) {
                        continue;
                    }

                    // Check if previous iteration was an air block
                    if (prevStonePatchNoise === -1) {
                        if (stonePatchNoise <= 0) {
                            // Keep the stone
                            topLayerTypeId = 0;
                            innerLayerTypeId = BlockRegistry.STONE.getId();
                        } else if (y >= this.seaLevel - 4 && y <= this.seaLevel + 1) {
                            // Fallback is grass and dirt
                            topLayerTypeId = BlockRegistry.GRASS.getId();
                            innerLayerTypeId = BlockRegistry.DIRT.getId();

                            // Add gravel patches
                            if (gravelPatchNoise) {
                                topLayerTypeId = 0;
                                innerLayerTypeId = BlockRegistry.GRAVEL.getId();
                            }

                            // Add sand patches
                            if (sandPatchNoise) {
                                topLayerTypeId = BlockRegistry.SAND.getId();
                                innerLayerTypeId = BlockRegistry.SAND.getId();
                            }
                        }

                        // Set water if it's below the sea level
                        if (y < this.seaLevel && topLayerTypeId === 0) {
                            topLayerTypeId = BlockRegistry.WATER.getId(); // TODO add water moving block
                        }

                        // Set flag that we hit a block
                        prevStonePatchNoise = stonePatchNoise;

                        // Set grass or dirt type depending on sea level height
                        if (y >= this.seaLevel - 1) {
                            primer.set(x, y, z, topLayerTypeId);
                        } else {
                            primer.set(x, y, z, innerLayerTypeId);
                        }
                        continue;
                    }

                    // Set further inner layer blocks
                    if (prevStonePatchNoise > 0) {
                        prevStonePatchNoise--;
                        primer.set(x, y, z, innerLayerTypeId);
                    }
                }
            }
        }
    }

    generateTerrainNoise(noiseX, noiseY, noiseZ, width, height, depth) {
        let strength = 684.412;

        // Generate terrain noise
        let terrainNoise1 = this.terrainGenerator1.generateNoiseOctaves(noiseX, noiseY, noiseZ, width, 1, depth, 1.0, 0.0, 1.0);
        let terrainNoise2 = this.terrainGenerator2.generateNoiseOctaves(noiseX, noiseY, noiseZ, width, 1, depth, 100, 0.0, 100);
        let terrainNoise3 = this.terrainGenerator3.generateNoiseOctaves(noiseX, noiseY, noiseZ, width, height, depth, strength / 80, strength / 160, strength / 80);
        let terrainNoise4 = this.terrainGenerator4.generateNoiseOctaves(noiseX, noiseY, noiseZ, width, height, depth, strength, strength, strength);
        let terrainNoise5 = this.terrainGenerator5.generateNoiseOctaves(noiseX, noiseY, noiseZ, width, height, depth, strength, strength, strength);

        // Output noise
        let output = [];

        let index = 0;
        let id = 0;

        // For each x, z coordinate
        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                let out1 = (terrainNoise1[id] + 256) / 512;
                if (out1 > 1.0) {
                    out1 = 1.0;
                }

                let maxY = 0.0;
                let out2 = terrainNoise2[id] / 8000;

                if (out2 < 0.0) {
                    out2 = -out2;
                }

                out2 = out2 * 3 - 3;

                if (out2 < 0.0) {
                    out2 /= 2;

                    if (out2 < -1) {
                        out2 = -1;
                    }

                    out2 /= 1.4;
                    out2 /= 2;
                    out1 = 0.0;
                } else {
                    if (out2 > 1.0) {
                        out2 = 1.0;
                    }
                    out2 /= 6;
                }

                out1 += 0.5;
                out2 = (out2 * height) / 16;
                id++;

                let h = height / 2 + out2 * 4;

                // Y loop
                for (let y = 0; y < height; y++) {
                    let noise = 0;
                    let value = ((y - h) * 12) / out1;

                    if (value < 0.0) {
                        value *= 4;
                    }

                    let out4 = terrainNoise4[index] / 512;
                    let out5 = terrainNoise5[index] / 512;
                    let out3 = (terrainNoise3[index] / 10 + 1.0) / 2;

                    if (out3 < 0.0) {
                        noise = out4;
                    } else if (out3 > 1.0) {
                        noise = out5;
                    } else {
                        noise = out4 + (out5 - out4) * out3;
                    }

                    noise -= value;

                    if (y > height - 4) {
                        let diff = (y - (height - 4)) / 3;
                        noise = noise * (1.0 - diff) + -10 * diff;
                    }

                    if (y < maxY) {
                        let diff = (maxY - y) / 4;

                        if (diff < 0.0) {
                            diff = 0.0;
                        }

                        if (diff > 1.0) {
                            diff = 1.0;
                        }
                        noise = noise * (1.0 - diff) + -10 * diff;
                    }

                    // Add noise to array and increase index
                    output[index] = noise;
                    index++;
                }
            }
        }

        return output;
    }

}