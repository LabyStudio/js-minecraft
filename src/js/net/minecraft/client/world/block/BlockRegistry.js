import BlockLog from "./type/BlockLog.js";
import BlockStone from "./type/BlockStone.js";
import BlockGrass from "./type/BlockGrass.js";
import BlockDirt from "./type/BlockDirt.js";
import BlockLeave from "./type/BlockLeave.js";
import BlockWater from "./type/BlockWater.js";
import BlockSand from "./type/BlockSand.js";
import BlockTorch from "./type/BlockTorch.js";
import Sound from "./sound/Sound.js";
import Block from "./Block.js";
import BlockWood from "./type/BlockWood.js";
import BlockBedrock from "./type/BlockBedrock.js";
import BlockGlass from "./type/BlockGlass.js";
import SoundGlass from "./sound/SoundGlass.js";
import BlockGravel from "./type/BlockGravel.js";
import BlockCobblestone from "./type/BlockCobblestone.js";
import BlockBricks from "./type/BlockBricks.js";
import BlockSponge from "./type/BlockSponge.js";
import BlockGold from "./type/BlockGold.js";
import BlockIron from "./type/BlockIron.js";
import BlockDoubleSlab from "./type/BlockDoubleSlab.js";
import BlockBookshelf from "./type/BlockBookshelf.js";
import BlockMossyCobblestone from "./type/BlockMossyCobblestone.js";
import BlockObsidian from "./type/BlockObsidian.js";
import BlockTNT from "./type/BlockTNT.js";
import BlockWool from "./type/BlockWool.js";
import BlockSapling from "./type/BlockSapling.js";
import BlockDandelion from "./type/BlockDandelion.js";
import BlockPoppy from "./type/BlockPoppy.js";
import BlockBrownMushroom from "./type/BlockBrownMushroom.js";
import BlockRedMushroom from "./type/BlockRedMushroom.js";
import BlockSlab from "./type/BlockSlab.js";
import SoundGrass from "./sound/SoundGrass.js";
import BlockJelly from "./type/BlockJelly.js";
import BlockHighGrass from "./type/BlockHighGrass.js";

export class BlockRegistry {

    static create() {
        // Sounds
        Block.sounds.stone = new Sound("stone", 1.0);
        Block.sounds.wood = new Sound("wood", 1.0);
        Block.sounds.gravel = new Sound("gravel", 1.0);
        Block.sounds.dirt = new Sound("dirt", 1.0);
        Block.sounds.grass = new SoundGrass("grass", 1.0);
        Block.sounds.cloth = new Sound("cloth", 1.0);
        Block.sounds.sand = new Sound("sand", 1.0);
        Block.sounds.glass = new SoundGlass("stone", 1.0);

        // Blocks
        BlockRegistry.STONE = new BlockStone(1, 0);
        BlockRegistry.GRASS = new BlockGrass(2, 1);
        BlockRegistry.DIRT = new BlockDirt(3, 2);
        BlockRegistry.COBBLE_STONE = new BlockCobblestone(4, 14);
        BlockRegistry.WOOD = new BlockWood(5, 10);
        BlockRegistry.SAPLING = new BlockSapling(6,43);
        BlockRegistry.BEDROCK = new BlockBedrock(7, 11);
        BlockRegistry.WATER = new BlockWater(9, 7);
        BlockRegistry.SAND = new BlockSand(24, 8);
        BlockRegistry.GRAVEL = new BlockGravel(13, 13);
        BlockRegistry.LOG = new BlockLog(17, 4);
        BlockRegistry.LEAVE = new BlockLeave(18, 6);
        BlockRegistry.SPONGE = new BlockSponge(19, 16);
        BlockRegistry.GLASS = new BlockGlass(20, 12);
        BlockRegistry.WOOL_RED = new BlockWool(35, 27,0);
        BlockRegistry.WOOL_ORANGE = new BlockWool(35, 28,1);
        BlockRegistry.WOOL_YELLOW = new BlockWool(35, 29,2);
        BlockRegistry.WOOL_LIME = new BlockWool(35, 30,3);
        BlockRegistry.WOOL_GREEN = new BlockWool(35, 31,4);
        BlockRegistry.WOOL_CYAN = new BlockWool(35, 32,5);
        BlockRegistry.WOOL_LIGHTBLUE = new BlockWool(35, 33,6);
        BlockRegistry.WOOL_BLUE = new BlockWool(35, 34,7);
        BlockRegistry.WOOL_PURPLE = new BlockWool(35, 35,8);
        BlockRegistry.WOOL_MAGENTA = new BlockWool(35, 36,9);
        BlockRegistry.WOOL_PINK = new BlockWool(35, 37,10);
        BlockRegistry.WOOL_WHITE = new BlockWool(35, 38,11);
        BlockRegistry.WOOL_LIGHTGRAY = new BlockWool(35, 39,12);
        BlockRegistry.WOOL_GRAY = new BlockWool(35, 40,13);
        BlockRegistry.WOOL_BLACK = new BlockWool(35, 41,14);
        BlockRegistry.WOOL_BROWN = new BlockWool(35, 42,15);
        BlockRegistry.DANDELION = new BlockDandelion(37, 44);
        BlockRegistry.POPPY = new BlockPoppy(38, 45);
        BlockRegistry.BROWN_MUSHROOM = new BlockBrownMushroom(39, 46);
        BlockRegistry.RED_MUSHROOM = new BlockRedMushroom(40, 47);
        BlockRegistry.GOLD = new BlockGold(41, 18);
        BlockRegistry.IRON = new BlockIron(42, 19);
        BlockRegistry.DOUBLE_SLAB = new BlockDoubleSlab(43, 26);
        BlockRegistry.SLAB = new BlockSlab(44, 26);
        BlockRegistry.BRICKS = new BlockBricks(45, 15);
        BlockRegistry.TNT = new BlockTNT(46, 21);
        BlockRegistry.BOOKSHELF = new BlockBookshelf(47, 17);
        BlockRegistry.MOSSY_COBBLE_STONE = new BlockMossyCobblestone(48, 23);
        BlockRegistry.OBSIDIAN = new BlockObsidian(49, 24);
        BlockRegistry.TORCH = new BlockTorch(50, 9);
        BlockRegistry.PINKJELLY = new BlockJelly(95, 48,6);//hit point should be 2 for magenta
        BlockRegistry.HIGHGRASS = new BlockHighGrass(31, 50,0);//hit point should be 2 for magenta
        BlockRegistry.HIGHGRASSB = new BlockHighGrass(175, 49,0);//hit point should be 2 for magenta
        //31 should be grass
    }
}