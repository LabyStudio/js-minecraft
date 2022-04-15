import Vector3 from "../../../../util/Vector3.js";

export default class Vertex {

    /**
     * A vertex contains a 3 float vector position and UV coordinates
     *
     * @param x X position
     * @param y Y position
     * @param z Z position
     */
    constructor(x, y, z) {
        this.position = new Vector3(x, y, z);
        this.u = 0;
        this.v = 0;
    }

    withUV(u, v) {
        this.u = u;
        this.v = v;
        return this;
    }

    static create(vector) {
        return new Vertex(vector.x, vector.y, vector.z);
    }

}