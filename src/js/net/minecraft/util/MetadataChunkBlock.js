import Block from "../client/world/block/Block.js";
import EnumSkyBlock from "./EnumSkyBlock.js";
import World from "../client/world/World.js";

export default class MetadataChunkBlock {

    constructor(type, x1, y1, z1, x2, y2, z2) {
        this.type = type;
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;
        this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;
    }

    updateBlockLightning(world) {
        let centerX = (this.x2 - this.x1) + 1;
        let centerY = (this.y2 - this.y1) + 1;
        let centerZ = (this.z2 - this.z1) + 1;
        let index = centerX * centerY * centerZ;
        if (index > 32768) {
            return;
        }

        for (let x = this.x1; x <= this.x2; x++) {
            for (let z = this.z1; z <= this.z2; z++) {
                if (!world.blockExists(x, 0, z)) {
                    continue;
                }

                let centerChunk = world.getChunkAt(x >> 4, z >> 4);
                if (!centerChunk.loaded) {
                    return;
                }

                for (let y = this.y1; y <= this.y2; y++) {
                    if (y < 0 || y >= World.TOTAL_HEIGHT) {
                        continue;
                    }

                    let savedLightValue = world.getSavedLightValue(this.type, x, y, z);
                    let newLevel = 0;
                    let typeId = world.getBlockAt(x, y, z);
                    let block = Block.getById(typeId);
                    let opacity = block === null || typeId === 0 ? 0 : Math.round(block.getOpacity() * 255);

                    if (opacity === 0) {
                        opacity = 1;
                    }

                    let level = 0;

                    if (this.type === EnumSkyBlock.SKY) {
                        if (world.isAboveGround(x, y, z)) {
                            level = 15;
                        }
                    } else if (this.type === EnumSkyBlock.BLOCK) {
                        level = typeId === 0 || block === null ? 0 : block.getLightValue();
                    }

                    if (opacity >= 15 && level === 0) {
                        newLevel = 0;
                    } else {
                        let x1Level = world.getSavedLightValue(this.type, x - 1, y, z);
                        let x2Level = world.getSavedLightValue(this.type, x + 1, y, z);
                        let bottomLevel = world.getSavedLightValue(this.type, x, y - 1, z);
                        let topLevel = world.getSavedLightValue(this.type, x, y + 1, z);
                        let z1Level = world.getSavedLightValue(this.type, x, y, z - 1);
                        let z2Level = world.getSavedLightValue(this.type, x, y, z + 1);

                        newLevel = x1Level;

                        if (x2Level > newLevel) {
                            newLevel = x2Level;
                        }
                        if (bottomLevel > newLevel) {
                            newLevel = bottomLevel;
                        }
                        if (topLevel > newLevel) {
                            newLevel = topLevel;
                        }
                        if (z1Level > newLevel) {
                            newLevel = z1Level;
                        }
                        if (z2Level > newLevel) {
                            newLevel = z2Level;
                        }
                        newLevel -= opacity;
                        if (newLevel < 0) {
                            newLevel = 0;
                        }
                        if (level > newLevel) {
                            newLevel = level;
                        }
                    }
                    if (savedLightValue === newLevel) {
                        continue;
                    }
                    world.setLightAt(this.type, x, y, z, newLevel);

                    let decreasedLevel = newLevel - 1;
                    if (decreasedLevel < 0) {
                        decreasedLevel = 0;
                    }

                    world.neighborLightPropagationChanged(this.type, x - 1, y, z, decreasedLevel);
                    world.neighborLightPropagationChanged(this.type, x, y - 1, z, decreasedLevel);
                    world.neighborLightPropagationChanged(this.type, x, y, z - 1, decreasedLevel);

                    if (x + 1 >= this.x2) {
                        world.neighborLightPropagationChanged(this.type, x + 1, y, z, decreasedLevel);
                    }
                    if (y + 1 >= this.y2) {
                        world.neighborLightPropagationChanged(this.type, x, y + 1, z, decreasedLevel);
                    }
                    if (z + 1 >= this.z2) {
                        world.neighborLightPropagationChanged(this.type, x, y, z + 1, decreasedLevel);
                    }
                }
            }
        }
    }

    isOutsideOf(x1, y1, z1, x2, y2, z2) {
        if (x1 >= this.x1 && y1 >= this.y1 && z1 >= this.z1 && x2 <= this.x2 && y2 <= this.y2 && z2 <= this.z2) {
            return true;
        }

        let radius = 1;
        if (x1 >= this.x1 - radius
            && y1 >= this.y1 - radius
            && z1 >= this.z1 - radius
            && x2 <= this.x2 + radius
            && y2 <= this.y2 + radius
            && z2 <= this.z2 + radius) {

            let distanceX = this.x2 - this.x1;
            let distanceY = this.y2 - this.y1;
            let distanceZ = this.z2 - this.z1;

            if (x1 > this.x1) {
                x1 = this.x1;
            }
            if (y1 > this.y1) {
                y1 = this.y1;
            }
            if (z1 > this.z1) {
                z1 = this.z1;
            }
            if (x2 < this.x2) {
                x2 = this.x2;
            }
            if (y2 < this.y2) {
                y2 = this.y2;
            }
            if (z2 < this.z2) {
                z2 = this.z2;
            }

            let newDistanceX = x2 - x1;
            let newDistanceY = y2 - y1;
            let newDistanceZ = z2 - z1;

            let size = distanceX * distanceY * distanceZ;
            let newSize = newDistanceX * newDistanceY * newDistanceZ;

            if (newSize - size <= 2) {
                this.x1 = x1;
                this.y1 = y1;
                this.z1 = z1;
                this.x2 = x2;
                this.y2 = y2;
                this.z2 = z2;
                return true;
            }
        }
        return false;
    }

}