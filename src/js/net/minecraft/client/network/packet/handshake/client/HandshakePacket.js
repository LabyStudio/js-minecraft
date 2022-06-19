import Packet from "../../../Packet.js";

export default class HandshakePacket extends Packet {

    constructor(version, nextState) {
        super();

        this.version = version;
        this.nextState = nextState;
    }

    write(buffer) {
        buffer.writeVarInt(this.version); // Protocol version
        buffer.writeString("localhost"); // Server address
        buffer.writeShort(25565); // Server port
        buffer.writeVarInt(this.nextState.getId()); // Next state
    }

    read(buffer) {

    }
}