import Vector3 from "./Vector3.js";
import Long from "../../../../../libraries/long.js";

export default class BlockPosition extends Vector3 {

    static NUM_X_BITS = 26;
    static NUM_Z_BITS = BlockPosition.NUM_X_BITS;
    static NUM_Y_BITS = 64 - BlockPosition.NUM_X_BITS - BlockPosition.NUM_Z_BITS;

    static Y_SHIFT = BlockPosition.NUM_Z_BITS;
    static X_SHIFT = BlockPosition.Y_SHIFT + BlockPosition.NUM_Y_BITS;

    static X_MASK = Long.fromNumber(1).shiftLeft(BlockPosition.NUM_X_BITS).subtract(1);
    static Y_MASK = Long.fromNumber(1).shiftLeft(BlockPosition.NUM_Y_BITS).subtract(1);
    static Z_MASK = Long.fromNumber(1).shiftLeft(BlockPosition.NUM_Z_BITS).subtract(1);

    constructor(x, y, z) {
        super(Math.floor(x), Math.floor(y), Math.floor(z));
    }

    getX() {
        return Math.floor(this.x);
    }

    getY() {
        return Math.floor(this.y);
    }

    getZ() {
        return Math.floor(this.z);
    }

    getChunkX() {
        return this.getX() >> 4;
    }

    getChunkY() {
        return this.getY() >> 4;
    }

    getChunkZ() {
        return this.getZ() >> 4;
    }

    static fromLong(serialized) {
        let x = serialized.shiftLeft(64 - BlockPosition.X_SHIFT - BlockPosition.NUM_X_BITS).shiftRight(64 - BlockPosition.NUM_X_BITS).toNumber();
        let y = serialized.shiftLeft(64 - BlockPosition.Y_SHIFT - BlockPosition.NUM_Y_BITS).shiftRight(64 - BlockPosition.NUM_Y_BITS).toNumber();
        let z = serialized.shiftLeft(64 - BlockPosition.NUM_Z_BITS).shiftRight(64 - BlockPosition.NUM_Z_BITS).toNumber();
        return new BlockPosition(x, y, z);
    }

    toLong() {
        return Long.fromNumber(this.getX()).and(BlockPosition.X_MASK).shiftLeft(BlockPosition.X_SHIFT)
            .or(Long.fromNumber(this.getY()).and(BlockPosition.Y_MASK).shiftLeft(BlockPosition.Y_SHIFT))
            .or(Long.fromNumber(this.getZ()).and(BlockPosition.Z_MASK).shiftLeft(0));
    }


}