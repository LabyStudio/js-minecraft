import Packet from "../../../Packet.js";

export default class ServerJoinGamePacket extends Packet {

    constructor() {
        super();

        this.entityId = 0;
        this.hardcoreMode = false;
        this.gameType = 0;
        this.dimension = 0;
        this.difficulty = 0;
        this.maxPlayers = 0;
        this.worldType = "";
        this.reducedDebugInfo = false;
    }

    write(buffer) {

    }

    read(buffer) {
        this.entityId = buffer.readVarInt();
        let bits = buffer.readByte();
        this.hardcoreMode = (bits & 8) === 8;
        this.gameType = bits & -9;
        this.dimension = buffer.readByte();
        this.difficulty = buffer.readByte();
        this.maxPlayers = buffer.readByte();
        this.worldType = buffer.readString();
        this.reducedDebugInfo = buffer.readBoolean();
    }

    handle(handler) {
        handler.handleJoinGame(this);
    }
}