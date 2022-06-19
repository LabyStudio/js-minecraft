import Packet from "../../../Packet.js";

export default class ServerBlockChangePacket extends Packet {

    constructor() {
        super();

        this.blockPosition = null;
    }

    read(buffer) {
        this.blockPosition = buffer.readBlockPosition();
        this.blockState = buffer.readVarInt();
    }

    handle(handler) {
        handler.handleBlockChange(this);
    }

    getBlockPosition() {
        return this.blockPosition;
    }

    getBlockState() {
        return this.blockState;
    }
}