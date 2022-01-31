window.BlockRenderer = class {

    constructor(worldRenderer) {
        this.worldRenderer = worldRenderer;
        this.tessellator = new Tessellator();
        this.tessellator.bindTexture(worldRenderer.terrainTexture);
    }

    renderBlock(world, group, typeId, x, y, z) {
        let boundingBox = new BoundingBox(0.0, 0.0, 0.0, 1.0, 1.0, 1.0);

        let values = EnumBlockFace.values();
        for (let i = 0; i < values.length; i++) {
            let face = values[i];
            if (this.shouldRenderFace(world, x, y, z, face)) {
                // Start drawing
                this.tessellator.startDrawing();

                // Render face
                this.renderFace(world, typeId, boundingBox, face, x, y, z);

                // Draw
                this.tessellator.draw(group);
            }
        }
    }

    shouldRenderFace(world, x, y, z, face) {
        let typeId = world.getBlockAt(x + face.x, y + face.y, z + face.z);
        return typeId === 0; /*|| Block.getById(typeId).isTransparent();*/
    }

    renderFace(world, typeId, boundingBox, face, x, y, z) {
        // Vertex mappings
        let minX = x + boundingBox.minX;
        let minY = y + boundingBox.minY;
        let minZ = z + boundingBox.minZ;
        let maxX = x + boundingBox.maxX;
        let maxY = y + boundingBox.maxY;
        let maxZ = z + boundingBox.maxZ;

        // UV Mapping
        let textureIndex = typeId;
        let minU = (textureIndex % 16) / 16.0;
        let maxU = minU + (16 / 256);
        let minV = Math.round(textureIndex / 16);
        let maxV = minV + (16 / 256);

        // Flip V
        minV = 1 - minV;
        maxV = 1 - maxV;

        // Classic lightning
        let brightness = 0.9 / 15.0 * 15 + 0.1;
        let color = brightness * face.getShading();
        this.tessellator.setColor(color, color, color);

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
        if (face === EnumBlockFace.EAST) {
            this.addBlockCorner(world, face, minX, maxY, minZ, maxU, minV);
            this.addBlockCorner(world, face, maxX, maxY, minZ, minU, minV);
            this.addBlockCorner(world, face, maxX, minY, minZ, minU, maxV);
            this.addBlockCorner(world, face, minX, minY, minZ, maxU, maxV);
        }
        if (face === EnumBlockFace.WEST) {
            this.addBlockCorner(world, face, minX, maxY, maxZ, minU, minV);
            this.addBlockCorner(world, face, minX, minY, maxZ, minU, maxV);
            this.addBlockCorner(world, face, maxX, minY, maxZ, maxU, maxV);
            this.addBlockCorner(world, face, maxX, maxY, maxZ, maxU, minV);
        }
        if (face === EnumBlockFace.NORTH) {
            this.addBlockCorner(world, face, minX, maxY, maxZ, maxU, minV);
            this.addBlockCorner(world, face, minX, maxY, minZ, minU, minV);
            this.addBlockCorner(world, face, minX, minY, minZ, minU, maxV);
            this.addBlockCorner(world, face, minX, minY, maxZ, maxU, maxV);
        }
        if (face === EnumBlockFace.SOUTH) {
            this.addBlockCorner(world, face, maxX, minY, maxZ, minU, maxV);
            this.addBlockCorner(world, face, maxX, minY, minZ, maxU, maxV);
            this.addBlockCorner(world, face, maxX, maxY, minZ, maxU, minV);
            this.addBlockCorner(world, face, maxX, maxY, maxZ, minU, minV);
        }
    }

    addBlockCorner(world, face, x, y, z, u, v) {
        this.tessellator.addVertexWithUV(x, y, z, u, v);
    }

}