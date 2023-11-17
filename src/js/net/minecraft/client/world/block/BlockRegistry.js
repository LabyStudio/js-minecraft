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
        BlockRegistry.SAND = new BlockSand(12, 8);
        BlockRegistry.GRAVEL = new BlockGravel(13, 13);
        BlockRegistry.LOG = new BlockLog(17, 4);
        BlockRegistry.LEAVE = new BlockLeave(18, 6);
        BlockRegistry.SPONGE = new BlockSponge(19, 16);
        BlockRegistry.GLASS = new BlockGlass(20, 12);
        BlockRegistry.WOOL_RED = new BlockWool(21, 27);
        BlockRegistry.WOOL_ORANGE = new BlockWool(22, 28);
        BlockRegistry.WOOL_YELLOW = new BlockWool(23, 29);
        BlockRegistry.WOOL_LIME = new BlockWool(24, 30);
        BlockRegistry.WOOL_GREEN = new BlockWool(25, 31);
        BlockRegistry.WOOL_CYAN = new BlockWool(26, 32);
        BlockRegistry.WOOL_LIGHTBLUE = new BlockWool(27, 33);
        BlockRegistry.WOOL_BLUE = new BlockWool(28, 34);
        BlockRegistry.WOOL_PURPLE = new BlockWool(29, 35);
        BlockRegistry.WOOL_MAGENTA = new BlockWool(30, 36);
        BlockRegistry.WOOL_PINK = new BlockWool(31, 37);
        BlockRegistry.WOOL_WHITE = new BlockWool(32, 38);
        BlockRegistry.WOOL_LIGHTGRAY = new BlockWool(33, 39);
        BlockRegistry.WOOL_GRAY = new BlockWool(34, 40);
        BlockRegistry.WOOL_BLACK = new BlockWool(35, 41);
        BlockRegistry.WOOL_BROWN = new BlockWool(36, 42);
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
        BlockRegistry.PINKJELLY = new BlockJelly(51, 48);

    }
}