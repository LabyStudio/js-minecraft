window.Vertex = class {

    /**
     * A vertex contains a 3 float vector position and UV coordinates
     *
     * @param x X position
     * @param y Y position
     * @param z Z position
     * @param u U mapping
     * @param v V mapping
     */
    constructor(x, y, z, u, v) {
        this.position = new Vector3(x, y, z);
        this.u = u;
        this.v = v;
    }

    /**
     * Create a new vertex of the current one with different UV mappings
     *
     * @param u New U mapping
     * @param v New V mapping
     * @return New vertex with the vector position of the current one
     */
    remap(u, v) {
        return new Vertex(this.position.x, this.position.y, this.position.z, u, v);
    }

}