import Random from "../../../util/Random.js";

export default class Generator {

    constructor(world, seed) {
        this.world = world;
        this.seed = seed;
        this.random = new Random(seed);
    }

    generateInChunk(chunkX, chunkZ, primer) {

    }

    generateAtBlock(x, y, z, primer) {

    }
}