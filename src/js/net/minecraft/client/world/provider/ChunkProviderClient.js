import ChunkProvider from "./ChunkProvider.js";
import Chunk from "../Chunk.js";

export default class ChunkProviderClient extends ChunkProvider {

    constructor(world) {
        super(world);

        this.emptyChunk = new Chunk(world, 0, 0);
        this.emptyChunk.generateSkylightMap();
        this.emptyChunk.generateBlockLightMap();
    }

    getChunkAt(x, z) {
        let index = x + (z << 16);
        let chunk = this.chunks.get(index);
        return typeof chunk === 'undefined' ? this.emptyChunk : chunk;
    }

}