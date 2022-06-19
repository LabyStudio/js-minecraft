import Packet from "../../../Packet.js";

export default class ServerChunkDataPacket extends Packet {

    constructor() {
        super();

        this.x = 0;
        this.z = 0;
        this.fullChunk = false;
        this.dataSize = 0;
        this.data = [];
    }

    read(buffer) {
        this.x = buffer.readInt();
        this.z = buffer.readInt();
        this.fullChunk = buffer.readBoolean();
        this.dataSize = buffer.readShort();
        this.data = buffer.readByteArray();
    }

    handle(handler) {
        handler.handleChunkData(this);
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

    getDataSize() {
        return this.dataSize;
    }

    getData() {
        return this.data;
    }
}