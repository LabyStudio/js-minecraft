window.BlockRenderer = class {

    constructor(worldRenderer) {
        this.worldRenderer = worldRenderer;
        this.tessellator = new Tessellator();
        this.tessellator.bindTexture(worldRenderer.terrainTexture);
    }

    renderBlock(world, group, typeId, x, y, z) {
        let boundingBox = new BoundingBox(0.0, 0.0, 0.0, 1.0, 1.0, 1.0);

        for (let face = 0; face < 6; face++) {
            this.tessellator.startDrawing();
            this.renderFace(world, typeId, boundingBox, face, x, y, z);
            this.tessellator.draw(group);
        }
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
        let minV = parseInt(textureIndex / 16); // TODO Math.round
        let maxV = minV + (16 / 256);

        // Flip V
        minV = 1 - minV;
        maxV = 1 - maxV;

        if (face === 0) {
            this.addBlockCorner(world, face, minX, minY, maxZ, minU, maxV);
            this.addBlockCorner(world, face, minX, minY, minZ, minU, minV);
            this.addBlockCorner(world, face, maxX, minY, minZ, maxU, minV);
            this.addBlockCorner(world, face, maxX, minY, maxZ, maxU, maxV);
        }
        if (face === 1) {
            this.addBlockCorner(world, face, maxX, maxY, maxZ, maxU, maxV);
            this.addBlockCorner(world, face, maxX, maxY, minZ, maxU, minV);
            this.addBlockCorner(world, face, minX, maxY, minZ, minU, minV);
            this.addBlockCorner(world, face, minX, maxY, maxZ, minU, maxV);
        }
        if (face === 2) {
            this.addBlockCorner(world, face, minX, maxY, minZ, maxU, minV);
            this.addBlockCorner(world, face, maxX, maxY, minZ, minU, minV);
            this.addBlockCorner(world, face, maxX, minY, minZ, minU, maxV);
            this.addBlockCorner(world, face, minX, minY, minZ, maxU, maxV);
        }
        if (face === 3) {
            this.addBlockCorner(world, face, minX, maxY, maxZ, minU, minV);
            this.addBlockCorner(world, face, minX, minY, maxZ, minU, maxV);
            this.addBlockCorner(world, face, maxX, minY, maxZ, maxU, maxV);
            this.addBlockCorner(world, face, maxX, maxY, maxZ, maxU, minV);
        }
        if (face === 4) {
            this.addBlockCorner(world, face, minX, maxY, maxZ, maxU, minV);
            this.addBlockCorner(world, face, minX, maxY, minZ, minU, minV);
            this.addBlockCorner(world, face, minX, minY, minZ, minU, maxV);
            this.addBlockCorner(world, face, minX, minY, maxZ, maxU, maxV);
        }
        if (face === 5) {
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