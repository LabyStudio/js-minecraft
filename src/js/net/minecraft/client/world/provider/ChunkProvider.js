import Chunk from "../Chunk.js";

export default class ChunkProvider {

    constructor(world) {
        this.world = world;
        this.chunks = new Map();
    }

    chunkExists(x, z) {
        let index = x + (z << 16);
        let chunk = this.chunks.get(index);
        return typeof chunk !== 'undefined';
    }

    getChunkAt(x, z) {
        let index = x + (z << 16);
        let chunk = this.chunks.get(index);
        if (typeof chunk === 'undefined') {
            chunk = this.loadChunk(x, z);
        }
        return chunk;
    }

    generateChunk(x, z) {
        let chunk = new Chunk(this.world, x, z);
        chunk.generateSkylightMap();
        chunk.generateBlockLightMap();
        return chunk;
    }

    populateChunk(chunk) {

    }

    loadChunk(x, z) {
        let index = x + (z << 16);
        let chunk = this.generateChunk(x, z)

        // Register and mark as loaded
        chunk.loaded = true;
        this.chunks.set(index, chunk);

        this.populateChunk(chunk);

        // Register in three.js
        this.world.group.add(chunk.group);

        return chunk;
    }

    unloadChunk(x, z) {
        let index = x + (z << 16);
        this.chunks.delete(index);
    }

    getChunks() {
        return this.chunks;
    }

}