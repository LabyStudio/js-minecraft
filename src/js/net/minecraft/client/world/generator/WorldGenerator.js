window.WorldGenerator = class {

    constructor(world, seed) {
        this.world = world;
        this.random = new Random(seed);

        this.waterLevel = 64;

        // Create noise for the ground height
        this.groundHeightNoise = new NoiseGeneratorOctaves(this.random, 8);
        this.hillNoise = new NoiseGeneratorCombined(new NoiseGeneratorOctaves(this.random, 4),
            new NoiseGeneratorCombined(new NoiseGeneratorOctaves(this.random, 4),
                new NoiseGeneratorOctaves(this.random, 4)));

        // Water noise
        this.sandInWaterNoise = new NoiseGeneratorOctaves(this.random, 8);

        // Hole in hills and islands
        this.holeNoise = new NoiseGeneratorOctaves(this.random, 3);
        this.islandNoise = new NoiseGeneratorOctaves(this.random, 3);

        // Caves
        this.caveNoise = new NoiseGeneratorOctaves(this.random, 8);

        // Population
        this.forestNoise = new NoiseGeneratorOctaves(this.random, 8);
    }

    generateChunk(chunk) {
        // For each block in the chunk
        for (let relX = 0; relX < ChunkSection.SIZE; relX++) {
            for (let relZ = 0; relZ < ChunkSection.SIZE; relZ++) {

                // Absolute position of the block
                let x = chunk.x * ChunkSection.SIZE + relX + 10000; // TODO fix this 10000 offset
                let z = chunk.z * ChunkSection.SIZE + relZ + 10000;

                // Extract height value of the noise
                let heightValue = this.groundHeightNoise.perlin(x, z);
                let hillValue = Math.max(0, this.hillNoise.perlin(x / 18, z / 18) * 6);

                // Calculate final height for this position
                let groundHeightY = Math.floor(heightValue / 10 + this.waterLevel + hillValue);

                if (groundHeightY < this.waterLevel) {
                    // Generate water
                    for (let y = 0; y <= this.waterLevel; y++) {
                        // Use noise to place sand in water
                        let sandInWater = this.sandInWaterNoise.perlin(x, z) < 0;
                        let block = y > groundHeightY ? Block.WATER : groundHeightY - y < 3 && sandInWater ? Block.SAND : Block.STONE;

                        // Send water, sand and stone
                        chunk.setBlockAt(x & 15, y, z & 15, block.getId());
                    }
                } else {
                    // Generate height, the highest block is grass
                    for (let y = 0; y <= groundHeightY; y++) {
                        // Use the height map to determine the start of the water by shifting it
                        let isBeach = heightValue < 5 && y < this.waterLevel + 2;
                        let block = y === groundHeightY ? isBeach ? Block.SAND : Block.GRASS : groundHeightY - y < 3 ? Block.DIRT : Block.STONE;

                        // Set sand, grass, dirt and stone
                        chunk.setBlockAt(x & 15, y, z & 15, block.getId());
                    }
                }

                /*
                int holeY = (int) (this.holeNouse.perlin(-x / 20F, -z / 20F) * 3F + this.waterLevel + 10);
                int holeHeight = (int) this.holeNouse.perlin(x / 4F, -z / 4F);
                if (holeHeight > 0) {
                    for (int y = holeY - holeHeight; y <= holeY + holeHeight; y++) {
                        chunk.setBlockAt(x & 15, y, z & 15, 1);
                    }
                }
                */

                // Random holes in hills
                let holePositionY = Math.floor(this.holeNoise.perlin(-x / 20, -z / 20) * 3 + this.waterLevel + 10);
                let holeHeight = Math.floor(this.holeNoise.perlin(x / 4, -z / 4));

                if (holeHeight > 0) {
                    for (let y = holePositionY - holeHeight; y <= holePositionY + holeHeight; y++) {
                        if (y > this.waterLevel) {
                            chunk.setBlockAt(x & 15, y, z & 15, 0);
                        }
                    }
                }

                // Floating islands
                let islandPositionY = Math.floor(this.islandNoise.perlin(-x / 10, -z / 10) * 3 + this.waterLevel + 10);
                let islandHeight = Math.floor(this.islandNoise.perlin(x / 4, -z / 4) * 4);
                let islandRarity = Math.floor(this.islandNoise.perlin(x / 40, z / 40) * 4) - 10;

                if (islandHeight > 0 && islandRarity > 0) {
                    for (let y = islandPositionY - islandHeight; y <= islandPositionY + islandHeight; y++) {
                        let block = y === islandPositionY + islandHeight ? Block.GRASS : (islandPositionY + islandHeight) - y < 2 ? Block.DIRT : Block.STONE;
                        chunk.setBlockAt(x & 15, y, z & 15, block.getId());
                    }
                }

                // Caves
            }
        }
    }

    populateChunk(chunkX, chunkZ) {
        for (let index = 0; index < 10; index++) {
            let x = this.random.nextInt(ChunkSection.SIZE);
            let z = this.random.nextInt(ChunkSection.SIZE);

            // Absolute position of the block
            let absoluteX = chunkX * ChunkSection.SIZE + x;
            let absoluteZ = chunkZ * ChunkSection.SIZE + z;

            // Use noise for a forest pattern
            let perlin = this.forestNoise.perlin(absoluteX * 10, absoluteZ * 10);
            if (perlin > 0 && this.random.nextInt(2) === 0) {

                // Get the highest block at this position
                let highestY = this.world.getHeightAt(absoluteX, absoluteZ);

                // Don't place a tree if there is no grass
                if (this.world.getBlockAt(absoluteX, highestY, absoluteZ) === Block.GRASS.getId()
                    && this.world.getBlockAt(absoluteX, highestY + 1, absoluteZ) === 0) {
                    let treeHeight = this.random.nextInt(2) + 5;

                    // Create tree log
                    for (let i = 0; i < treeHeight; i++) {
                        this.world.setBlockAt(absoluteX, highestY + i + 1, absoluteZ, Block.LOG.getId());
                    }

                    // Create big leave ring
                    for (let tx = -2; tx <= 2; tx++) {
                        for (let ty = 0; ty < 2; ty++) {
                            for (let tz = -2; tz <= 2; tz++) {
                                let isCorner = Math.abs(tx) === 2 && Math.abs(tz) === 2;
                                if (isCorner && this.random.nextBoolean()) {
                                    continue;
                                }

                                // Place leave if there is no block yet
                                if (!this.world.isSolidBlockAt(absoluteX + tx, highestY + treeHeight + ty - 2, absoluteZ + tz)) {
                                    this.world.setBlockAt(absoluteX + tx, highestY + treeHeight + ty - 2, absoluteZ + tz, Block.LEAVE.getId());
                                }
                            }
                        }
                    }

                    // Create small leave ring on top
                    for (let tx = -1; tx <= 1; tx++) {
                        for (let ty = 0; ty < 2; ty++) {
                            for (let tz = -1; tz <= 1; tz++) {
                                let isCorner = Math.abs(tx) === 1 && Math.abs(tz) === 1;
                                if (isCorner && (ty === 1 || this.random.nextBoolean())) {
                                    continue;
                                }

                                // Place leave if there is no block yet
                                if (!this.world.isSolidBlockAt(absoluteX + tx, highestY + treeHeight + ty, absoluteZ + tz)) {
                                    this.world.setBlockAt(absoluteX + tx, highestY + treeHeight + ty, absoluteZ + tz, Block.LEAVE.getId());
                                }
                            }
                        }
                    }
                }
            }
        }

    }
}