import Packet from "../../../Packet.js";
import {format} from "../../../../../../../../../libraries/chat.js";

export default class LoginDisconnectPacket extends Packet {

    constructor(message) {
        super();

        this.message = message;
    }

    write(buffer) {
        buffer.writeString(this.message);
    }

    read(buffer) {
        this.message = format(JSON.parse(buffer.readString(32767)));
    }

    handle(handler) {
        handler.handleLoginDisconnect(this);
    }
}