import Packet from "../../../Packet.js";

export default class ServerDestroyEntitiesPacket extends Packet {

    constructor() {
        super();

        this.entityIds = [];
    }

    read(buffer) {
        let amount = buffer.readVarInt();
        for (let i = 0; i < amount; i++) {
            this.entityIds.push(buffer.readVarInt());
        }
    }

    handle(handler) {
        handler.handleDestroyEntities(this);
    }

    getEntityIds() {
        return this.entityIds;
    }
}