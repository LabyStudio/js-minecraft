export default class Primer {

    constructor(chunk) {
        this.chunk = chunk;
    }

    get(x, y, z) {
        return this.chunk.getBlockAt(x, y, z);
    }

    set(x, y, z, typeId) {
        this.chunk.setBlockAt(x, y, z, typeId);
    }

    setByIndex(index, typeId) {
        this.set(index >> 12 & 15, index >> 8 & 15, index & 15, typeId);
    }
}