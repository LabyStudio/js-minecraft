import Packet from "../../../Packet.js";

export default class ClientKeepAlivePacket extends Packet {

    constructor(id = 0) {
        super();

        this.id = id;
    }

    write(buffer) {
        buffer.writeVarInt(this.id);
    }

    getId() {
        return this.id;
    }
}