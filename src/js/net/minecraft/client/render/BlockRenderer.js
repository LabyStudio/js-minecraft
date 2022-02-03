window.BlockRenderer = class {

    static CLASSIC_LIGHTNING = false;

    constructor(worldRenderer) {
        this.worldRenderer = worldRenderer;
        this.tessellator = new Tessellator();
        this.tessellator.bindTexture(worldRenderer.terrainTexture);
    }

    renderBlock(world, group, block, x, y, z) {
        let boundingBox = block.getBoundingBox(world, x, y, z);

        // Render all faces
        let values = EnumBlockFace.values();
        for (let i = 0; i < values.length; i++) {
            let face = values[i];

            // Check if face is hidden by other block
            if (block.shouldRenderFace(world, x, y, z, face)) {

                // Render face
                this.renderFace(world, block, boundingBox, face, x, y, z);
            }
        }
    }

    renderFace(world, block, boundingBox, face, x, y, z) {
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
        let minV = Math.floor(textureIndex / 16);
        let maxV = minV + (16 / 256);

        // Flip V
        minV = 1 - minV;
        maxV = 1 - maxV;

        // Classic lightning
        if (BlockRenderer.CLASSIC_LIGHTNING) {
            let brightness = 0.9 / 15.0 * world.getTotalLightAt(minX + face.x, minY + face.y, minZ + face.z) + 0.1;
            let color = brightness * face.getShading();
            this.tessellator.setColor(color, color, color);
        }

        if (face === EnumBlockFace.BOTTOM) {
            this.addBlockCorner(world, face, minX, minY, maxZ, minU, maxV);
            this.addBlockCorner(world, face, minX, minY, minZ, minU, minV);
            this.addBlockCorner(world, face, maxX, minY, minZ, maxU, minV);
            this.addBlockCorner(world, face, maxX, minY, maxZ, maxU, maxV);
        }
        if (face === EnumBlockFace.TOP) {
            this.addBlockCorner(world, face, maxX, maxY, maxZ, maxU, maxV);
            this.addBlockCorner(world, face, maxX, maxY, minZ, maxU, minV);
            this.addBlockCorner(world, face, minX, maxY, minZ, minU, minV);
            this.addBlockCorner(world, face, minX, maxY, maxZ, minU, maxV);
        }
        if (face === EnumBlockFace.NORTH) {
            this.addBlockCorner(world, face, minX, maxY, minZ, maxU, minV);
            this.addBlockCorner(world, face, maxX, maxY, minZ, minU, minV);
            this.addBlockCorner(world, face, maxX, minY, minZ, minU, maxV);
            this.addBlockCorner(world, face, minX, minY, minZ, maxU, maxV);
        }
        if (face === EnumBlockFace.SOUTH) {
            this.addBlockCorner(world, face, minX, maxY, maxZ, minU, minV);
            this.addBlockCorner(world, face, minX, minY, maxZ, minU, maxV);
            this.addBlockCorner(world, face, maxX, minY, maxZ, maxU, maxV);
            this.addBlockCorner(world, face, maxX, maxY, maxZ, maxU, minV);
        }
        if (face === EnumBlockFace.WEST) {
            this.addBlockCorner(world, face, minX, maxY, maxZ, maxU, minV);
            this.addBlockCorner(world, face, minX, maxY, minZ, minU, minV);
            this.addBlockCorner(world, face, minX, minY, minZ, minU, maxV);
            this.addBlockCorner(world, face, minX, minY, maxZ, maxU, maxV);
        }
        if (face === EnumBlockFace.EAST) {
            this.addBlockCorner(world, face, maxX, minY, maxZ, minU, maxV);
            this.addBlockCorner(world, face, maxX, minY, minZ, maxU, maxV);
            this.addBlockCorner(world, face, maxX, maxY, minZ, maxU, minV);
            this.addBlockCorner(world, face, maxX, maxY, maxZ, minU, minV);
        }
    }

    addBlockCorner(world, face, x, y, z, u, v) {
        // Smooth lightning
        if (!BlockRenderer.CLASSIC_LIGHTNING) {
            this.setAverageColor(world, face, x, y, z);
        }

        this.tessellator.addVertexWithUV(x, y, z, u, v);
    }

    setAverageColor(world, face, x, y, z) {
        // Get the average light level of all 4 blocks at this corner
        let lightLevelAtThisCorner = this.getAverageLightLevelAt(world, x, y, z);

        // Convert light level from [0 - 15] to [0.1 - 1.0]
        let brightness = 0.9 / 15.0 * lightLevelAtThisCorner + 0.1;
        let color = brightness * face.getShading();

        // Set color with shading
        this.tessellator.setColor(color, color, color);
    }

    getAverageLightLevelAt(world, x, y, z) {
        let totalLightLevel = 0;
        let totalBlocks = 0;

        // For all blocks around this corner
        for (let offsetX = -1; offsetX <= 0; offsetX++) {
            for (let offsetY = -1; offsetY <= 0; offsetY++) {
                for (let offsetZ = -1; offsetZ <= 0; offsetZ++) {
                    let typeId = world.getBlockAt(x + offsetX, y + offsetY, z + offsetZ);

                    // Does it contain air?
                    if (typeId === 0 || Block.getById(typeId).isTransparent()) {

                        // Sum up the light levels
                        totalLightLevel += world.getTotalLightAt(x + offsetX, y + offsetY, z + offsetZ);
                        totalBlocks++;
                    }
                }
            }
        }

        // Calculate the average light level of all surrounding blocks
        return totalBlocks === 0 ? 0 : totalLightLevel / totalBlocks;
    }

}