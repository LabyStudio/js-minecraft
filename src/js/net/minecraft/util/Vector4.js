export default class Vector4 {

    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    addVector(x, y, z, w) {
        return new Vector4(this.x + x, this.y + y, this.z + z, this.w + w);
    }

}