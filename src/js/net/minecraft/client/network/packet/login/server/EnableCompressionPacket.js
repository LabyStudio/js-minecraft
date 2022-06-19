import Packet from "../../../Packet.js";

export default class EnableCompressionPacket extends Packet {

    constructor() {
        super();

        this.compressionThreshold = 0;
    }

    write(buffer) {

    }

    read(buffer) {
        this.compressionThreshold = buffer.readVarInt();
    }

    handle(handler) {
        handler.handleEnableCompression(this);
    }

    getCompressionThreshold() {
        return this.compressionThreshold;
    }
}