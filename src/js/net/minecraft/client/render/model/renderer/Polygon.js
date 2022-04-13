window.Polygon = class {

    /**
     * Bind UV mappings on the vertices
     *
     * @param vertices Vertex array
     * @param minU     Minimum U coordinate
     * @param minV     Minimum V coordinate
     * @param maxU     Maximum U coordinate
     * @param maxV     Maximum V coordinate
     */
    constructor(vertices, minU, minV, maxU, maxV) {
        this.vertices = vertices;
        this.vertexCount = vertices.length;

        // Map UV on vertices
        vertices[0] = vertices[0].remap(maxU, minV);
        vertices[1] = vertices[1].remap(minU, minV);
        vertices[2] = vertices[2].remap(minU, maxV);
        vertices[3] = vertices[3].remap(maxU, maxV);
    }

    render(tessellator) {
        // Set color of polygon
        tessellator.setColor(1, 1, 1);

        // Render all vertices
        for (let i = 3; i >= 0; i--) {
            let vertex = this.vertices[i];

            // Bind UV mappings and render vertex
            tessellator.addVertexWithUV(
                vertex.position.x,
                vertex.position.y,
                vertex.position.z,
                vertex.u / 64.0,
                vertex.v / 32.0
            );
        }
    }
}