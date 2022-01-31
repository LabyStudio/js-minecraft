window.EnumBlockFace = class {

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
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
    c.NORTH = new EnumBlockFace(-1, 0, 0);
    c.EAST = new EnumBlockFace(0, 0, -1);
    c.SOUTH = new EnumBlockFace(1, 0, 0);
    c.WEST = new EnumBlockFace(0, 0, 1);
}
