import Packet from "../../../Packet.js";

export default class ServerDisconnectPacket extends Packet {

    constructor() {
        super();

        this.reason = "";
    }

    read(buffer) {
        this.reason = buffer.readTextComponent();
    }

    handle(handler) {
        handler.handleDisconnect(this);
    }

    getReason() {
        return this.reason;
    }
}