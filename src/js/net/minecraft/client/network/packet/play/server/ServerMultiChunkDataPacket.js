import Packet from "../../../Packet.js";
import ServerChunkDataPacket from "./ServerChunkDataPacket.js";

export default class ServerMultiChunkDataPacket extends Packet {

    constructor() {
        super();

        this.overworld = false;
        this.chunkData = [];
    }

    read(buffer) {
        this.overworld = buffer.readBoolean();

        let amount = buffer.readVarInt();
        for (let i = 0; i < amount; i++) {
            let x = buffer.readInt();
            let y = buffer.readInt();
            let dataSize = buffer.readShort() & 65535;
            let data = buffer.readByteArray();

            this.chunkData.push(new ServerChunkDataPacket(x, y, dataSize, data));
        }
    }

    handle(handler) {
        handler.handleMultiChunkData(this);
    }

    getChunkData() {
        return this.chunkData;
    }

    isOverworld() {
        return this.overworld;
    }
}