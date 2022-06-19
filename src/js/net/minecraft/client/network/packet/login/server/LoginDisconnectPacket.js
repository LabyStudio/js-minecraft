import Packet from "../../../Packet.js";

export default class LoginDisconnectPacket extends Packet {

    constructor(message) {
        super();

        this.message = message;
    }

    write(buffer) {
        buffer.writeString(this.message);
    }

    read(buffer) {
        this.message = buffer.readTextComponent();
    }

    handle(handler) {
        handler.handleLoginDisconnect(this);
    }
}