import Packet from "../../../Packet.js";

export default class ServerEntityMovementPacket extends Packet {

    constructor() {
        super();

        this.position = false;
        this.rotation = false;

        this.entityId = 0;

        this.onGround = false;

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.yaw = 0;
        this.pitch = 0;
    }

    read(buffer) {
        this.entityId = buffer.readVarInt();

        if (this.position) {
            this.x = buffer.readByte();
            this.y = buffer.readByte();
            this.z = buffer.readByte();
        }

        if (this.rotation) {
            this.yaw = buffer.readByte();
            this.pitch = buffer.readByte();
        }

        this.onGround = buffer.readBoolean();
    }

    handle(packetHandler) {
        packetHandler.handleEntityMovement(this);
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