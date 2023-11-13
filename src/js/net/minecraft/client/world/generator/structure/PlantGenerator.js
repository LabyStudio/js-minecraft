import {BlockRegistry} from "../../block/BlockRegistry.js";
import Generator from "../Generator.js";

export default class PlantGenerator extends Generator {

    constructor(world, seed) {
        super(world, seed);
    }

    generateAtBlock(x, y, z) {
        // Generate random type
        let plantTypeId = this.random.nextInt(4) + 37;

        // Check if we have enough space for the tree to grow
        if (this.world.getBlockAt(x, y, z) !== 0) {
            return false;
        }

        // Check if plant can grow here
        let typeIdBelowPlant = this.world.getBlockAt(x, y - 1, z);
        if (typeIdBelowPlant !== BlockRegistry.GRASS.getId() && typeIdBelowPlant !== BlockRegistry.DIRT.getId() || y >= 128) {
            return false;
        }

        // Create plant
        this.world.setBlockAt(x, y, z, plantTypeId);

        return true;
    }
}