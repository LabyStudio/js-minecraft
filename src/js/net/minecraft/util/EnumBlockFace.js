window.EnumBlockFace = class {

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getShading() {
        return this.isXAxis() ? 0.6 : this.isYAxis() ? 1.0 : 0.8;
    }

    isXAxis() {
        return this.x !== 0;
    }

    isYAxis() {
        return this.y !== 0;
    }

    isZAxis() {
        return this.z !== 0;
    }

    static values() {
        return [
            EnumBlockFace.TOP,
            EnumBlockFace.BOTTOM,
            EnumBlockFace.NORTH,
            EnumBlockFace.EAST,
            EnumBlockFace.SOUTH,
            EnumBlockFace.WEST
        ];
    }
}

{
    let c = window.EnumBlockFace;
    c.TOP = new EnumBlockFace(0, 1, 0);
    c.BOTTOM = new EnumBlockFace(0, -1, 0);
    c.NORTH = new EnumBlockFace(0, 0, -1);
    c.EAST = new EnumBlockFace(1, 0, 0);
    c.SOUTH = new EnumBlockFace(0, 0, 1);
    c.WEST = new EnumBlockFace(-1, 0, 0);
}
