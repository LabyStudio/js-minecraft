import Random from "../../../../util/Random.js";
import {BlockRegistry} from "../../block/BlockRegistry.js";
import Generator from "../Generator.js";

export default class CaveGenerator extends Generator {

    constructor(world, seed) {
        super(world, seed);

        this.chunkRange = 8;
    }

    generateInChunk(originChunkX, originChunkZ, primer) {
        let offset = this.chunkRange;
        let {seedX, seedZ} = this.generateSeedOffset();

        // Generate entire cave over 16x16 chunk area
        for (let chunkX = originChunkX - offset; chunkX <= originChunkX + offset; chunkX++) {
            for (let chunkZ = originChunkZ - offset; chunkZ <= originChunkZ + offset; chunkZ++) {
                // Set seed for position
                this.setSeedOffset(chunkX, chunkZ, seedX, seedZ);

                // Generate entire cave
                this.generateCave(chunkX, chunkZ, originChunkX, originChunkZ, primer);
            }
        }
    }

    generateCave(chunkX, chunkZ, originChunkX, originChunkZ, primer) {
        let num = this.random.nextInt(this.random.nextInt(this.random.nextInt(40) + 1) + 1);
        if (this.random.nextInt(15) !== 0) {
            num = 0;
        }

        // Generate multiple caves in the given area
        for (let i = 0; i < num; i++) {
            let x = chunkX * 16 + this.random.nextInt(16);
            let y = this.random.nextInt(this.random.nextInt(120) + 8);
            let z = chunkZ * 16 + this.random.nextInt(16);

            let amount = 1;

            if (this.random.nextInt(4) === 0) {
                this.generateBasicCaveAtBlock(originChunkX, originChunkZ, primer, x, y, z);
                amount += this.random.nextInt(4);
            }

            for (let j = 0; j < amount; j++) {
                let rotation1 = this.random.nextFloat() * Math.PI * 2.0;
                let rotation2 = ((this.random.nextFloat() - 0.5) * 2.0) / 8;
                let amplitude = this.random.nextFloat() * 2.0 + this.random.nextFloat();
                this.generateCaveAtBlock(originChunkX, originChunkZ, primer, x, y, z, amplitude, rotation1, rotation2, 0, 0, 1.0);
            }
        }
    }

    generateBasicCaveAtBlock(originChunkX, originChunkZ, primer, x, y, z) {
        this.generateCaveAtBlock(originChunkX, originChunkZ, primer,
            x, y, z,
            1.0 + this.random.nextFloat() * 6,
            0.0, 0.0,
            -1, -1, 0.5
        );
    }

    generateCaveAtBlock(originChunkX, originChunkZ, primer, absoluteX, absoluteY, absoluteZ, amplitude, rotation1, rotation2, progress, distance, strength) {
        let centerX = originChunkX * 16 + 8;
        let centerZ = originChunkZ * 16 + 8;

        let motion2 = 0;
        let motion1 = 0;

        let random = new Random(this.random.nextLong());
        if (distance <= 0) {
            let range = this.chunkRange * 16 - 16;
            distance = range - random.nextInt(Math.floor(range / 4));
        }

        let isBeginning = false;
        if (progress === -1) {
            progress = Math.floor(distance / 2);
            isBeginning = true;
        }

        let maxProgress = random.nextInt(Math.floor(distance / 2)) + Math.floor(distance / 4);
        let isStrong = random.nextInt(6) === 0;

        for (; progress < distance; progress++) {
            let value = 1.5 + (Math.sin((progress * Math.PI) / distance) * amplitude);
            let valueWithStrength = value * strength;

            let cos = Math.cos(rotation2);
            let sin = Math.sin(rotation2);

            absoluteX += Math.cos(rotation1) * cos;
            absoluteY += sin;
            absoluteZ += Math.sin(rotation1) * cos;

            if (isStrong) {
                rotation2 *= 0.92;
            } else {
                rotation2 *= 0.7;
            }

            rotation2 += motion1 * 0.1;
            rotation1 += motion2 * 0.1;

            motion1 *= 0.9;
            motion2 *= 0.75;

            motion1 += (random.nextFloat() - random.nextFloat()) * random.nextFloat() * 2.0;
            motion2 += (random.nextFloat() - random.nextFloat()) * random.nextFloat() * 4;

            if (!isBeginning && progress === maxProgress && amplitude > 1.0) {
                this.generateCaveAtBlock(
                    originChunkX, originChunkZ, primer,
                    absoluteX, absoluteY, absoluteZ,
                    random.nextFloat() * 0.5 + 0.5, rotation1 - 1.570796, rotation2 / 3, progress, distance, 1.0
                );
                this.generateCaveAtBlock(
                    originChunkX, originChunkZ, primer,
                    absoluteX, absoluteY, absoluteZ,
                    random.nextFloat() * 0.5 + 0.5, rotation1 + 1.570796, rotation2 / 3, progress, distance, 1.0
                );
                return;
            }

            if (!isBeginning && random.nextInt(4) === 0) {
                continue;
            }

            let distanceToCenterX = absoluteX - centerX;
            let distanceToCenterY = absoluteZ - centerZ;

            let progressInvert = distance - progress;
            let shiftedAmplitude = amplitude + 2.0 + 16;

            if ((distanceToCenterX * distanceToCenterX + distanceToCenterY * distanceToCenterY)
                - progressInvert * progressInvert > shiftedAmplitude * shiftedAmplitude) {
                return;
            }

            if (absoluteX < centerX - 16 - value * 2
                || absoluteZ < centerZ - 16 - value * 2
                || absoluteX > centerX + 16 + value * 2
                || absoluteZ > centerZ + 16 + value * 2) {
                continue;
            }

            distanceToCenterX = Math.floor(absoluteX - value) - originChunkX * 16 - 1;
            let layerX = (Math.floor(absoluteX + value) - originChunkX * 16) + 1;

            distanceToCenterY = Math.floor(absoluteY - valueWithStrength) - 1;
            let layerY = Math.floor(absoluteY + valueWithStrength) + 1;

            progressInvert = Math.floor(absoluteZ - value) - originChunkZ * 16 - 1;
            let layerZ = (Math.floor(absoluteZ + value) - originChunkZ * 16) + 1;

            distanceToCenterX = Math.max(distanceToCenterX, 0);
            layerX = Math.min(layerX, 16);
            distanceToCenterY = Math.max(distanceToCenterY, 1);
            layerY = Math.min(layerY, 120);
            progressInvert = Math.max(progressInvert, 0);
            layerZ = Math.min(layerZ, 16);

            let isWaterCave = false;

            // Check for water
            for (let x = Math.floor(distanceToCenterX); !isWaterCave && x < layerX; x++) {
                for (let z = Math.floor(progressInvert); !isWaterCave && z < layerZ; z++) {
                    for (let y = layerY + 1; !isWaterCave && y >= distanceToCenterY - 1; y--) {
                        if (y < 0 || y >= 128) {
                            continue;
                        }

                        // Get current block
                        let typeId = primer.get(x, y, z)

                        // Check if we have water in here
                        if (typeId === BlockRegistry.WATER.getId() || typeId === BlockRegistry.WATER.getId()) { // TODO one of them WATER MOVING
                            isWaterCave = true;
                        }

                        if (y !== distanceToCenterY - 1 && x !== distanceToCenterX && x !== layerX - 1 && z !== progressInvert && z !== layerZ - 1) {
                            y = Math.floor(distanceToCenterY);
                        }
                    }
                }
            }
            if (isWaterCave) {
                continue;
            }

            // For each block on layer x
            for (let x = Math.floor(distanceToCenterX); x < layerX; x++) {
                let offsetX = (((x + originChunkX * 16) + 0.5) - absoluteX) / value;

                // For each block on layer z
                for (let z = Math.floor(progressInvert); z < layerZ; z++) {
                    let offsetZ = (((z + originChunkZ * 16) + 0.5) - absoluteZ) / value;

                    let totalY = layerY;
                    let hasGrass = false;

                    // For each block on layer y
                    for (let y = layerY - 1; y >= distanceToCenterY; y--) {
                        let offsetY = ((y + 0.5) - absoluteY) / valueWithStrength;

                        // Check if the offset vector length is below 1
                        if (offsetY > -0.7 && offsetX * offsetX + offsetY * offsetY + offsetZ * offsetZ < 1.0) {
                            let typeId = primer.get(x, totalY, z)

                            // We found grass
                            if (typeId === BlockRegistry.GRASS.getId()) {
                                hasGrass = true;
                            }

                            // Check if we can create a cave here
                            if (typeId === BlockRegistry.STONE.getId() || typeId === BlockRegistry.DIRT.getId() || typeId === BlockRegistry.GRASS.getId()) {

                                if (y < 10) {
                                    // Lava cave
                                    primer.set(x, totalY, z, BlockRegistry.WATER.getId()); // TODO LAVA STILL
                                } else {
                                    // Normal cave
                                    primer.set(x, totalY, z, 0);

                                    // Grow grass if we have dirt in here
                                    if (hasGrass && primer.get(x, totalY - 1, z) === BlockRegistry.DIRT.getId()) {
                                        primer.set(x, totalY - 1, z, BlockRegistry.GRASS.getId());
                                    }
                                }
                            }
                        }

                        // Go further down
                        totalY--;
                    }
                }
            }

            if (isBeginning) {
                break;
            }
        }
    }

}