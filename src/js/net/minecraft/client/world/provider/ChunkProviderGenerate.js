import ChunkProvider from "./ChunkProvider.js";
import WorldGenerator from "../generator/WorldGenerator.js";
import Random from "../../../util/Random.js";

export default class ChunkProviderGenerate extends ChunkProvider {

    constructor(world, seed) {
        super(world);

        this.generator = new WorldGenerator(world, seed);
    }

    generateChunk(x, z) {
        return this.generator.newChunk(this.world, x, z);
    }

    populateChunk(chunk) {
        let x = chunk.x;
        let z = chunk.z;

        // Populate the chunk
        if (!chunk.isTerrainPopulated && this.chunkExists(x + 1, z + 1) && this.chunkExists(x, z + 1) && this.chunkExists(x + 1, z)) {
            this._populateChunkAt(x, z);
        }
        if (this.chunkExists(x - 1, z) && !this.getChunkAt(x - 1, z).isTerrainPopulated && this.chunkExists(x - 1, z + 1) && this.chunkExists(x, z + 1) && this.chunkExists(x - 1, z)) {
            this._populateChunkAt(x - 1, z);
        }
        if (this.chunkExists(x, z - 1) && !this.getChunkAt(x, z - 1).isTerrainPopulated && this.chunkExists(x + 1, z - 1) && this.chunkExists(x, z - 1) && this.chunkExists(x + 1, z)) {
            this._populateChunkAt(x, z - 1);
        }
        if (this.chunkExists(x - 1, z - 1) && !this.getChunkAt(x - 1, z - 1).isTerrainPopulated && this.chunkExists(x - 1, z - 1) && this.chunkExists(x, z - 1) && this.chunkExists(x - 1, z)) {
            this._populateChunkAt(x - 1, z - 1);
        }
    }

    _populateChunkAt(x, z) {
        let chunk = this.getChunkAt(x, z);
        if (!chunk.isTerrainPopulated) {
            chunk.isTerrainPopulated = true;

            // Populate chunk
            this.generator.populateChunk(chunk.x, chunk.z);
        }
    }

    findSpawn() {
        let spawn = this.world.spawn;
        if (spawn.y <= 0) {
            spawn.y = 64;
        }

        let random = new Random(this.generator.getSeed());
        while (this.getBlockAboveSeaLevel(spawn.x, spawn.z) === 0) {
            spawn.x += random.nextInt(8) - random.nextInt(8);
            spawn.z += random.nextInt(8) - random.nextInt(8);
        }
    }

    getBlockAboveSeaLevel(x, z) {
        let y = this.generator.getSeaLevel();
        while (this.world.getBlockAt(x, y + 1, z) !== 0) {
            y++;
        }
        return this.world.getBlockAt(x, y, z);
    }

}