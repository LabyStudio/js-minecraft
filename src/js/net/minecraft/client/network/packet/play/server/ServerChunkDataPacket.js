import Packet from "../../../Packet.js";

export default class ServerChunkDataPacket extends Packet {

    constructor(x, y, mask, data) {
        super();

        this.x = x;
        this.z = y;
        this.fullChunk = true;
        this.mask = mask;
        this.data = data;
    }

    read(buffer) {
        this.x = buffer.readInt();
        this.z = buffer.readInt();
        this.fullChunk = buffer.readBoolean();
        this.mask = buffer.readShort();
        this.data = buffer.readByteArray();
    }

    handle(handler) {
        handler.handleChunkData(this);
    }

    setData(data) {
        this.data = data;
    }

    getX() {
        return this.x;
    }

    getZ() {
        return this.z;
    }

    isFullChunk() {
        return this.fullChunk;
    }

    getMask() {
        return this.mask;
    }

    getData() {
        return this.data;
    }

    static _calculateLength(bits, isOverworld, isFullChunk) {
        let x = bits * 2 * 16 * 16 * 16;
        let z = bits * 16 * 16 * 16 / 2;
        let overworld = isOverworld ? bits * 16 * 16 * 16 / 2 : 0;
        let fullChunk = isFullChunk ? 256 : 0;
        return x + z + overworld + fullChunk;
    }
}