import Packet from "../../../Packet.js";
import {format} from "../../../../../../../../../libraries/chat.js";

export default class ServerDisconnectPacket extends Packet {

    constructor() {
        super();

        this.reason = "";
    }

    read(buffer) {
        this.reason = format(JSON.parse(buffer.readString(32767)));
    }

    handle(handler) {
        handler.handleDisconnect(this);
    }

    getReason() {
        return this.reason;
    }
}