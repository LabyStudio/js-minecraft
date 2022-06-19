import Packet from "../../../Packet.js";

export default class ServerPlayerPositionRotationPacket extends Packet {

    constructor() {
        super();

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.yaw = 0;
        this.pitch = 0;

        this.flags = 0;
    }

    read(buffer) {
        this.x = buffer.readDouble();
        this.y = buffer.readDouble();
        this.z = buffer.readDouble();

        this.yaw = buffer.readFloat();
        this.pitch = buffer.readFloat();

        this.flags = buffer.readByte();
    }

    handle(handler) {
        handler.handleServerPlayerPositionRotation(this);
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

    getFlags() {
        return this.flags;
    }

    hasFlag(bit) {
        return (this.flags & bit) === bit;
    }
}