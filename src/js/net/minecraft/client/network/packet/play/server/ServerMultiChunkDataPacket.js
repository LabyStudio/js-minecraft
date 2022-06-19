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
            let mask = buffer.readShort() & 65535;
            let length = ServerChunkDataPacket._calculateLength(ServerMultiChunkDataPacket._bitCount(mask), this.overworld, true);
            this.chunkData.push(new ServerChunkDataPacket(x, y, mask, new Uint8Array(length)));
        }

        for (let i = 0; i < amount; i++) {
            let data = this.chunkData[i].getData();
            buffer.read(data, data.length);
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

    static _bitCount(bits) {
        bits = bits - ((bits >>> 1) & 0x55555555);
        bits = (bits & 0x33333333) + ((bits >>> 2) & 0x33333333);
        bits = (bits + (bits >>> 4)) & 0x0f0f0f0f;
        bits = bits + (bits >>> 8);
        bits = bits + (bits >>> 16);
        return bits & 0x3f;
    }
}