export default class EnumBlockFace {

    static TOP = new EnumBlockFace(0, 1, 0);
    static BOTTOM = new EnumBlockFace(0, -1, 0);
    static NORTH = new EnumBlockFace(0, 0, -1);
    static EAST = new EnumBlockFace(1, 0, 0);
    static SOUTH = new EnumBlockFace(0, 0, 1);
    static WEST = new EnumBlockFace(-1, 0, 0);

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

    opposite() {
        if (this === EnumBlockFace.TOP) {
            return EnumBlockFace.BOTTOM;
        }
        if (this === EnumBlockFace.BOTTOM) {
            return EnumBlockFace.TOP;
        }

        if (this === EnumBlockFace.NORTH) {
            return EnumBlockFace.SOUTH;
        }
        if (this === EnumBlockFace.SOUTH) {
            return EnumBlockFace.NORTH;
        }

        if (this === EnumBlockFace.EAST) {
            return EnumBlockFace.WEST;
        }
        if (this === EnumBlockFace.WEST) {
            return EnumBlockFace.EAST;
        }

        return null;
    }

    equals(other) {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    static values() {
        return [EnumBlockFace.TOP, EnumBlockFace.BOTTOM, EnumBlockFace.NORTH, EnumBlockFace.EAST, EnumBlockFace.SOUTH, EnumBlockFace.WEST];
    }
}