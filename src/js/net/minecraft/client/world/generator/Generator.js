import Random from "../../../util/Random.js";
import Long from "../../../../../../../libraries/long.js";

export default class Generator {

    constructor(world, seed) {
        this.world = world;
        this.seed = seed;
        this.random = new Random(seed);

        this.seaLevel = 64;
    }

    generateInChunk(chunkX, chunkZ, primer) {

    }

    generateAtBlock(x, y, z, primer) {

    }

    generateSeedOffset() {
        this.random.setSeed(this.seed);

        let seedX = this.random.nextLong().divide(2).multiply(2).add(1);
        let seedZ = this.random.nextLong().divide(2).multiply(2).add(1);

        return {seedX, seedZ};
    }

    setSeedOffset(chunkX, chunkZ, seedX, seedZ) {
        let seed = Long.fromInt(chunkX).multiply(seedX).add(Long.fromInt(chunkZ).multiply(seedZ)).xor(this.seed);
        this.random.setSeed(seed);
    }

    setChunkSeed(chunkX, chunkZ) {
        let {seedX, seedZ} = this.generateSeedOffset();
        this.setSeedOffset(chunkX, chunkZ, seedX, seedZ);
    }

    getSeed() {
        return this.seed;
    }

    getSeaLevel() {
        return this.seaLevel;
    }
}