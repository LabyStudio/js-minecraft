import Packet from "../../../Packet.js";

export default class ServerEntityMetadataPacket extends Packet {

    constructor() {
        super();

        this.entityId = 0;
        this.metaData = null;
    }

    read(buffer) {
        this.entityId = buffer.readVarInt();
        this.metaData = buffer.readMetaData();
    }

    handle(handler) {
        handler.handleEntityMetadata(this);
    }

    getEntityId() {
        return this.entityId;
    }

    getMetaData() {
        return this.metaData;
    }
}