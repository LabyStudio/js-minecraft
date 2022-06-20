import Packet from "../../../Packet.js";

export default class ServerEntityTeleportPacket extends Packet {

    constructor() {
        super();

        this.entityId = 0;

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.yaw = 0;
        this.pitch = 0;

        this.onGround = false;
    }

    read(buffer) {
        this.entityId = buffer.readVarInt();
        this.x = buffer.readInt();
        this.y = buffer.readInt();
        this.z = buffer.readInt();
        this.yaw = buffer.readByte();
        this.pitch = buffer.readByte();
        this.onGround = buffer.readBoolean();
    }

    handle(packetHandler) {
        packetHandler.handleEntityTeleport(this);
    }

    getEntityId() {
        return this.entityId;
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

    isOnGround() {
        return this.onGround;
    }
}