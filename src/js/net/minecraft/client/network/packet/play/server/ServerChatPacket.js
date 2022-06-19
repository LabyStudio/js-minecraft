import Packet from "../../../Packet.js";

export default class ServerChatPacket extends Packet {

    constructor() {
        super();

        this.message = "";
        this.type = 0;
    }

    read(buffer) {
        this.message = buffer.readTextComponent();
        this.type = buffer.readByte();
    }

    handle(handler) {
        handler.handleServerChat(this);
    }

    getMessage() {
        return this.message;
    }

    getType() {
        return this.type;
    }
}