import Packet from "../../../Packet.js";

export default class StatusResponsePacket extends Packet {

    constructor() {
        super();
    }

    write(buffer) {

    }

    read(buffer) {
        this.object = JSON.parse(buffer.readString());
    }

    handle(packetHandler) {
        packetHandler.handleStatusResponse(this)
    }
}