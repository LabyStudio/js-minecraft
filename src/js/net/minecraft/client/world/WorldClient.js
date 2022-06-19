import World from "./World.js";
import ChunkProviderClient from "./provider/ChunkProviderClient.js";

export default class WorldClient extends World {

    constructor(minecraft) {
        super(minecraft);

        // Set chunk provider to remote chunk loader
        this.setChunkProvider(new ChunkProviderClient(this))
    }
}