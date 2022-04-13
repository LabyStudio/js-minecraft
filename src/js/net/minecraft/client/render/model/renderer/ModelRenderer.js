window.ModelRenderer = class {

    /**
     * Create cube object
     */
    constructor(textureWidth, textureHeight) {
        this.textureWidth = textureWidth;
        this.textureHeight = textureHeight;

        this.textureOffsetX = 0;
        this.textureOffsetY = 0;

        this.xRotation = 0;
        this.yRotation = 0;
        this.zRotation = 0;

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.bone = new THREE.Object3D();
    }

    /**
     * Set the texture offset position of the cube
     *
     * @param textureOffsetX Offset position x
     * @param textureOffsetY Offset position y
     */
    setTextureOffset(textureOffsetX, textureOffsetY) {
        this.textureOffsetX = textureOffsetX;
        this.textureOffsetY = textureOffsetY;

        return this;
    }

    /**
     * Create box using offset position and width, height and depth
     *
     * @param offsetX X offset of the render position
     * @param offsetY Y offset of the render position
     * @param offsetZ Z offset of the render position
     * @param width   Cube width
     * @param height  Cube height
     * @param depth   Cube depth
     */
    setBox(offsetX, offsetY, offsetZ, width, height, depth) {
        this.polygons = [];

        let x = offsetX + width;
        let y = offsetY + height;
        let z = offsetZ + depth;

        // Create bottom vertex points of cube
        let vertexBottom1 = new Vertex(offsetX, offsetY, offsetZ);
        let vertexBottom2 = new Vertex(x, offsetY, offsetZ);
        let vertexBottom3 = new Vertex(offsetX, offsetY, z);
        let vertexBottom4 = new Vertex(x, offsetY, z);

        // Create top vertex points of cube
        let vertexTop1 = new Vertex(x, y, z);
        let vertexTop2 = new Vertex(offsetX, y, z);
        let vertexTop3 = new Vertex(x, y, offsetZ);
        let vertexTop4 = new Vertex(offsetX, y, offsetZ);

        // Create polygons for each cube side
        this.polygons[0] = new Polygon(
            [vertexBottom4, vertexBottom2, vertexTop3, vertexTop1],
            this.textureOffsetX + depth + width,
            this.textureOffsetY + depth,
            this.textureOffsetX + depth + width + depth,
            this.textureOffsetY + depth + height,
            this.textureWidth, this.textureHeight
        );

        this.polygons[1] = new Polygon(
            [vertexBottom1, vertexBottom3, vertexTop2, vertexTop4],
            this.textureOffsetX,
            this.textureOffsetY + depth,
            this.textureOffsetX + depth,
            this.textureOffsetY + depth + height,
            this.textureWidth, this.textureHeight
        );

        this.polygons[2] = new Polygon(
            [vertexBottom4, vertexBottom3, vertexBottom1, vertexBottom2],
            this.textureOffsetX + depth,
            this.textureOffsetY,
            this.textureOffsetX + depth + width,
            this.textureOffsetY + depth,
            this.textureWidth, this.textureHeight
        );

        this.polygons[3] = new Polygon(
            [vertexTop3, vertexTop4, vertexTop2, vertexTop1],
            this.textureOffsetX + depth + width,
            this.textureOffsetY,
            this.textureOffsetX + depth + width + width,
            this.textureOffsetY + depth,
            this.textureWidth, this.textureHeight
        );

        this.polygons[4] = new Polygon(
            [vertexBottom2, vertexBottom1, vertexTop4, vertexTop3],
            this.textureOffsetX + depth,
            this.textureOffsetY + depth,
            this.textureOffsetX + depth + width,
            this.textureOffsetY + depth + height,
            this.textureWidth, this.textureHeight
        );

        this.polygons[5] = new Polygon(
            [vertexBottom3, vertexBottom4, vertexTop1, vertexTop2],
            this.textureOffsetX + depth + width + depth,
            this.textureOffsetY + depth,
            this.textureOffsetX + depth + width + depth + width,
            this.textureOffsetY + depth + height,
            this.textureWidth, this.textureHeight
        );

        return this;
    }

    /**
     * Set the absolute position of the cube
     *
     * @param x Absolute x position of cube
     * @param y Absolute y position of cube
     * @param z Absolute z position of cube
     */
    setPosition(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    rebuild(tessellator, group) {
        // Start drawing
        tessellator.startDrawing();

        // Render polygons
        for (let i = 0; i < 6; i++) {
            let polygon = this.polygons[i];
            polygon.render(tessellator);
        }

        // Finish drawing
        tessellator.draw(this.bone);
        group.add(this.bone);
    }

    render(group) {
        this.bone.position.setX(this.x);
        this.bone.position.setY(this.y);
        this.bone.position.setZ(this.z);

        this.bone.rotation.order = 'ZYX';
        this.bone.rotation.x = this.xRotation;
        this.bone.rotation.y = this.yRotation;
        this.bone.rotation.z = this.zRotation;

        this.bone.updateMatrix();
    }

}