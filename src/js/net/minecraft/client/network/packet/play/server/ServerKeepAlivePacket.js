import Packet from "../../../Packet.js";

export default class ServerKeepAlivePacket extends Packet {

    constructor() {
        super();

        this.id = 0;
    }

    read(buffer) {
        this.id = buffer.readVarInt();
    }

    handle(handler) {
        handler.handleKeepAlive(this);
    }

    getId() {
        return this.id;
    }
}