import BlockLog from "./BlockLog.js";
import BlockStone from "./BlockStone.js";
import BlockGrass from "./BlockGrass.js";
import BlockDirt from "./BlockDirt.js";
import BlockLeave from "./BlockLeave.js";
import BlockWater from "./BlockWater.js";
import BlockSand from "./BlockSand.js";
import BlockTorch from "./BlockTorch.js";
import Sound from "./sound/Sound.js";
import Block from "./Block.js";

export class BlockRegistry {

    static create() {
        // Sounds
        Block.sounds.stone = new Sound("stone", 1.0);
        Block.sounds.wood = new Sound("wood", 1.0);
        Block.sounds.gravel = new Sound("gravel", 1.0);
        Block.sounds.grass = new Sound("grass", 1.0);
        Block.sounds.cloth = new Sound("cloth", 1.0);
        Block.sounds.sand = new Sound("sand", 1.0);

        // Blocks
        Block.STONE = new BlockStone(1, 0);
        Block.GRASS = new BlockGrass(2, 1);
        Block.DIRT = new BlockDirt(3, 2);
        Block.LOG = new BlockLog(17, 4);
        Block.LEAVE = new BlockLeave(18, 6);
        Block.WATER = new BlockWater(9, 7);
        Block.SAND = new BlockSand(12, 8)
        Block.TORCH = new BlockTorch(50, 9)
    }
}