import Packet from "../../../Packet.js";
import {format} from "../../../../../../../../../libraries/chat.js";

export default class ServerChatPacket extends Packet {

    constructor() {
        super();

        this.message = "";
        this.type = 0;
    }

    read(buffer) {
        this.message = format(JSON.parse(buffer.readString(32767)), {
            useAnsiCodes: true
        });
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