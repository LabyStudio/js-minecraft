import Packet from "../../../Packet.js";

export default class ClientChatPacket extends Packet {

    constructor(message) {
        super();

        this.message = message;
    }

    write(buffer) {
        buffer.writeString(this.message);
    }
}