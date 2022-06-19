import Packet from "../../../Packet.js";

export default class ClientPlayerMovementPacket extends Packet {

    constructor(onGround) {
        super();

        this.position = false;
        this.rotation = false;

        this.onGround = onGround;

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.yaw = 0;
        this.pitch = 0;
    }

    write(buffer) {
        if (this.position) {
            buffer.writeDouble(this.x);
            buffer.writeDouble(this.y);
            buffer.writeDouble(this.z);
        }

        if (this.rotation) {
            buffer.writeFloat(this.yaw);
            buffer.writeFloat(this.pitch);
        }

        buffer.writeBoolean(this.onGround);
    }
}