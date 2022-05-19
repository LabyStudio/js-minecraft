import EnumBlockFace from "../../util/EnumBlockFace.js";
import BlockRenderType from "../../util/BlockRenderType.js";
import Tessellator from "./Tessellator.js";
import MathHelper from "../../util/MathHelper.js";
import Block from "../world/block/Block.js";

export default class BlockRenderer {

    constructor(worldRenderer) {
        this.worldRenderer = worldRenderer;
        this.tessellator = new Tessellator();
        this.tessellator.bindTexture(worldRenderer.textureTerrain);
    }

    renderBlock(world, block, ambientOcclusion, x, y, z) {
        switch (block.getRenderType()) {
            case BlockRenderType.BLOCK:
                this.renderSolidBlock(world, block, ambientOcclusion, x, y, z);
                break;
            case BlockRenderType.TORCH:
                this.renderTorch(world, block, x, y, z);
                break;
        }
    }

    renderSolidBlock(world, block, ambientOcclusion, x, y, z) {
        let boundingBox = block.getBoundingBox(world, x, y, z);

        // Render all faces
        let values = EnumBlockFace.values();
        for (let i = 0; i < values.length; i++) {
            let face = values[i];

            // Check if face is hidden by other block
            if (world === null || block.shouldRenderFace(world, x, y, z, face)) {

                // Render face
                this.renderFace(world, block, boundingBox, face, ambientOcclusion, x, y, z);
            }
        }
    }

    renderFace(world, block, boundingBox, face, ambientOcclusion, x, y, z) {
        let chunkX = x >> 4;
        let chunkY = y >> 4;
        let chunkZ = z >> 4;

        // Vertex mappings
        let minX = x + boundingBox.minX;
        let minY = y + boundingBox.minY;
        let minZ = z + boundingBox.minZ;
        let maxX = x + boundingBox.maxX;
        let maxY = y + boundingBox.maxY;
        let maxZ = z + boundingBox.maxZ;

        // UV Mapping
        let textureIndex = block.getTextureForFace(face);
        let minU = (textureIndex % 16) / 16.0;
        let maxU = minU + (16 / 256);
        let minV = Math.floor(textureIndex / 16) / 16.0;
        let maxV = minV + (16 / 256);

        // Flip V
        minV = 1 - minV;
        maxV = 1 - maxV;

        // Get color multiplier
        let color = block.getColor(world, x, y, z, face);
        let red = (color >> 16 & 255) / 255.0;
        let green = (color >> 8 & 255) / 255.0;
        let blue = (color & 255) / 255.0;

        // Classic lightning
        if (!ambientOcclusion) {
            let level = world === null ? 15 : world.getTotalLightAt(minX + face.x, minY + face.y, minZ + face.z);
            let brightness = 0.9 / 15.0 * level + 0.1;
            let shade = brightness * face.getShading();
            this.tessellator.setColor(red * shade, green * shade, blue * shade);
        }

        // Set opacity of block (Using alpha channel in texture right now)
        // this.tessellator.setAlpha(1 - block.getTransparency());

        // Add face to tessellator
        this.addFace(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX, minY, minZ, maxX, maxY, maxZ, minU, minV, maxU, maxV, red, green, blue);
    }

    addFace(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX, minY, minZ, maxX, maxY, maxZ, minU, minV, maxU, maxV, red = 1, green = 1, blue = 1) {
        if (face === EnumBlockFace.BOTTOM) {
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX, minY, maxZ, maxU, maxV, red, green, blue);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX, minY, minZ, maxU, minV, red, green, blue);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX, minY, minZ, minU, minV, red, green, blue);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX, minY, maxZ, minU, maxV, red, green, blue);
        }
        if (face === EnumBlockFace.TOP) {
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX, maxY, maxZ, minU, maxV, red, green, blue);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX, maxY, minZ, minU, minV, red, green, blue);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX, maxY, minZ, maxU, minV, red, green, blue);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX, maxY, maxZ, maxU, maxV, red, green, blue);
        }
        if (face === EnumBlockFace.NORTH) {
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX, maxY, minZ, minU, minV, red, green, blue);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX, minY, minZ, minU, maxV, red, green, blue);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX, minY, minZ, maxU, maxV, red, green, blue);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX, maxY, minZ, maxU, minV, red, green, blue);
        }
        if (face === EnumBlockFace.SOUTH) {
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX, maxY, maxZ, maxU, minV, red, green, blue);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX, maxY, maxZ, minU, minV, red, green, blue);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX, minY, maxZ, minU, maxV, red, green, blue);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX, minY, maxZ, maxU, maxV, red, green, blue);
        }
        if (face === EnumBlockFace.WEST) {
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX, minY, maxZ, minU, maxV, red, green, blue);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX, minY, minZ, maxU, maxV, red, green, blue);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX, maxY, minZ, maxU, minV, red, green, blue);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX, maxY, maxZ, minU, minV, red, green, blue);
        }
        if (face === EnumBlockFace.EAST) {
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX, maxY, maxZ, maxU, minV, red, green, blue);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX, maxY, minZ, minU, minV, red, green, blue);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX, minY, minZ, minU, maxV, red, green, blue);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX, minY, maxZ, maxU, maxV, red, green, blue);
        }
    }

    addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, x, y, z, u, v, red, green, blue) {
        // Smooth lightning
        if (ambientOcclusion) {
            this.setAverageBrightness(world, face, x, y, z, red, green, blue);
        }

        this.tessellator.addVertexWithUV(x - (chunkX << 4), y - (chunkY << 4), z - (chunkZ << 4), u, v);
    }

    setAverageBrightness(world, face, x, y, z, red = 1, green = 1, blue = 1) {
        // Get the average light level of all 4 blocks at this corner
        let lightLevelAtThisCorner = this.getAverageLightLevelAt(world, x, y, z);

        // Convert light level from [0 - 15] to [0.1 - 1.0]
        let brightness = 0.9 / 15.0 * lightLevelAtThisCorner + 0.1;
        let shading = brightness * face.getShading();

        // Transform brightness of edge
        this.tessellator.setColor(red * shading, green * shading, blue * shading);
    }

    getAverageLightLevelAt(world, x, y, z) {
        if (world === null) {
            return 15;
        }

        let totalLightLevel = 0;
        let totalBlocks = 0;

        // For all blocks around this corner
        for (let offsetX = -1; offsetX <= 0; offsetX++) {
            for (let offsetY = -1; offsetY <= 0; offsetY++) {
                for (let offsetZ = -1; offsetZ <= 0; offsetZ++) {
                    let typeId = world.getBlockAt(x + offsetX, y + offsetY, z + offsetZ);
                    let block = typeId === 0 ? null : Block.getById(typeId);

                    // Does it contain air?
                    if (block === null || block.isTranslucent()) {
                        // Sum up the light levels
                        totalLightLevel += world.getTotalLightAt(x + offsetX, y + offsetY, z + offsetZ);
                        totalBlocks++;
                    } else {
                        // Count the block if it's on the same level
                        if (offsetY === 0) {
                            totalBlocks++;
                        }
                    }
                }
            }
        }

        // Calculate the average light level of all surrounding blocks
        return totalBlocks === 0 ? 0 : totalLightLevel / totalBlocks;
    }

    renderTorch(world, block, x, y, z) {
        let chunkX = x >> 4;
        let chunkY = y >> 4;
        let chunkZ = z >> 4;

        // Thickness of the torch
        let size = 1 / 16;

        let distortX = 0;
        let distortZ = 0;

        // Attach torch at wall
        if (world != null) {
            switch (world.getBlockDataAt(x, y, z)) {
                case 1:
                    distortX = -0.2;
                    break;
                case 2:
                    distortX = 0.2;
                    break;
                case 3:
                    distortZ = -0.2;
                    break;
                case 4:
                    distortZ = 0.2;
                    break;
            }
        }

        // Model type
        let centerX = 0.5 + distortX * 1.5;
        let centerZ = 0.5 + distortZ * 1.5;

        // Lift the torch up
        if (distortX !== 0 || distortZ !== 0) {
            y += 0.2;
        }

        // Vertex mappings
        let minX = x + centerX - size;
        let minY = y;
        let minZ = z + centerZ - size;
        let maxX = x + centerX + size;
        let maxY = y + 10 / 16;
        let maxZ = z + centerZ + size;

        // UV Mapping
        let textureIndex = block.getTextureForFace(EnumBlockFace.NORTH);
        let minU = (textureIndex % 16) / 16.0;
        let minV = Math.floor(textureIndex / 16) / 16.0;

        // Cut to torch texture at 7:6
        minU += 7 / 256;
        minV += 6 / 256;

        // Size of torch texture (2x10)
        let maxU = minU + 2 / 256;
        let maxV = minV + 10 / 256;

        // Flip V
        minV = 1 - minV;
        maxV = 1 - maxV;

        // Set color with shading
        this.tessellator.setColor(1, 1, 1);

        // Add faces to tessellator
        this.addDistortFace(world, EnumBlockFace.NORTH, false, chunkX, chunkY, chunkZ, minX, minY, minZ, maxX, maxY, maxZ, minU, minV, maxU, maxV, distortX, distortZ);
        this.addDistortFace(world, EnumBlockFace.EAST, false, chunkX, chunkY, chunkZ, minX, minY, minZ, maxX, maxY, maxZ, minU, minV, maxU, maxV, distortX, distortZ);
        this.addDistortFace(world, EnumBlockFace.SOUTH, false, chunkX, chunkY, chunkZ, minX, minY, minZ, maxX, maxY, maxZ, minU, minV, maxU, maxV, distortX, distortZ);
        this.addDistortFace(world, EnumBlockFace.WEST, false, chunkX, chunkY, chunkZ, minX, minY, minZ, maxX, maxY, maxZ, minU, minV, maxU, maxV, distortX, distortZ);
        this.addFace(world, EnumBlockFace.TOP, false, chunkX, chunkY, chunkZ, minX, minY, minZ, maxX, maxY, maxZ, minU, minV, maxU, maxV + 8 / 256);
    }

    addDistortFace(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX, minY, minZ, maxX, maxY, maxZ, minU, minV, maxU, maxV, distortX, distortZ) {
        if (face === EnumBlockFace.NORTH) {
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX, maxY, minZ, minU, minV);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX + distortX, minY, minZ + distortZ, minU, maxV);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX + distortX, minY, minZ + distortZ, maxU, maxV);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX, maxY, minZ, maxU, minV);
        }
        if (face === EnumBlockFace.SOUTH) {
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX, maxY, maxZ, maxU, minV);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX, maxY, maxZ, minU, minV);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX + distortX, minY, maxZ + distortZ, minU, maxV);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX + distortX, minY, maxZ + distortZ, maxU, maxV);
        }
        if (face === EnumBlockFace.WEST) {
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX + distortX, minY, maxZ + distortZ, minU, maxV);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX + distortX, minY, minZ + distortZ, maxU, maxV);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX, maxY, minZ, maxU, minV);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, minX, maxY, maxZ, minU, minV);
        }
        if (face === EnumBlockFace.EAST) {
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX, maxY, maxZ, maxU, minV);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX, maxY, minZ, minU, minV);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX + distortX, minY, minZ + distortZ, minU, maxV);
            this.addBlockCorner(world, face, ambientOcclusion, chunkX, chunkY, chunkZ, maxX + distortX, minY, maxZ + distortZ, maxU, maxV);
        }
    }

    renderBlockInHandThirdPerson(group, block, brightness) {
        this.tessellator.startDrawing();

        // Render block
        this.renderBlock(null, block, false, 0, 0, 0);

        // Change brightness
        this.tessellator.transformBrightness(brightness);

        // Create mesh
        let mesh = this.tessellator.draw(group);
        mesh.geometry.center();

        // Relative position
        mesh.position.x = 0;
        mesh.position.y = 9;
        mesh.position.z = -5;

        // Rotation
        mesh.rotation.y = Math.PI / 4;

        // Scale
        mesh.scale.x = 6;
        mesh.scale.y = -6;
        mesh.scale.z = 6;
    }

    renderBlockInFirstPerson(group, block, brightness) {
        this.tessellator.startDrawing();

        // Render block
        this.renderBlock(null, block, false, 0, 0, 0);

        // Change brightness
        this.tessellator.transformBrightness(brightness);

        // Create mesh
        let mesh = this.tessellator.draw(group);
        mesh.geometry.center();

        // Scale
        mesh.scale.x = 16;
        mesh.scale.y = 16;
        mesh.scale.z = 16;
    }

    renderGuiBlock(group, block, x, y, size, brightness) {
        this.tessellator.startDrawing();
        this.tessellator.setColor(1, 1, 1);

        let boundingBox = block.getBoundingBox(null, 0, 0, 0);

        // Render block by type
        switch (block.getRenderType()) {
            case BlockRenderType.BLOCK:
                this.renderFace(null, block, boundingBox, EnumBlockFace.TOP, false, 0, 0, 0);
                this.renderFace(null, block, boundingBox, EnumBlockFace.NORTH, false, 0, 0, 0);
                this.renderFace(null, block, boundingBox, EnumBlockFace.EAST, false, 0, 0, 0);
                break;
            default:
                this.renderGuiItem(block);
                break;
        }

        // Change brightness
        this.tessellator.transformBrightness(brightness);

        // Create mesh
        let mesh = this.tessellator.draw(group);
        mesh.geometry.center();

        // Rotate block
        switch (block.getRenderType()) {
            case BlockRenderType.BLOCK:
                mesh.rotation.x = MathHelper.toRadians(45 / 1.5);
                mesh.rotation.y = -MathHelper.toRadians(45 + 90);
                break;
            default:
                mesh.rotation.y = MathHelper.toRadians(180);
                size += 5;
                break;
        }

        // Relative position
        mesh.position.x = x;
        mesh.position.y = -y;
        mesh.position.z = -10;

        // Scale
        mesh.scale.x = size;
        mesh.scale.y = size;
        mesh.scale.z = size;
    }

    renderGuiItem(block) {
        // Vertex mappings
        let minX = 0;
        let minY = 0;
        let minZ = 0;
        let maxX = 1;
        let maxY = 1;
        let maxZ = 1;

        let offset = (1 / 256);

        // UV Mapping
        let textureIndex = block.getTextureForFace(EnumBlockFace.NORTH);
        let minU = (textureIndex % 16) / 16.0;
        let maxU = minU + (16 / 256);
        let minV = Math.floor(textureIndex / 16) / 16.0;
        let maxV = minV + (16 / 256);

        // Flip V
        minV = 1 - minV;
        maxV = 1 - maxV;

        minU += offset;
        maxU -= offset;
        minV -= offset;
        maxV += offset;

        // Render item
        this.addFace(null, EnumBlockFace.NORTH, false, 0, 0, 0, minX, minY, minZ, maxX, maxY, maxZ, minU, minV, maxU, maxV);
    }
}