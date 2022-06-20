import Packet from "../../../Packet.js";

export default class ServerSpawnPlayerPacket extends Packet {

    constructor() {
        super();

        this.entityId = 0;
        this.uuid = null;

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.yaw = 0;
        this.pitch = 0;

        this.currentItem = 0;
    }

    read(buffer) {
        this.entityId = buffer.readVarInt();
        this.uuid = buffer.readUUID();

        this.x = buffer.readInt();
        this.y = buffer.readInt();
        this.z = buffer.readInt();

        this.yaw = buffer.readByte();
        this.pitch = buffer.readByte();

        this.currentItem = buffer.readShort();
        this.metaData = buffer.readMetaData();
    }

    handle(handler) {
        handler.handleServerSpawnPlayer(this);
    }

    getEntityId() {
        return this.entityId;
    }

    getUUID() {
        return this.uuid;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getZ() {
        return this.z;
    }

    getYaw() {
        return this.yaw;
    }

    getPitch() {
        return this.pitch;
    }

    getMetaData() {
        return this.metaData;
    }

    getCurrentItem() {
        return this.currentItem;
    }
}