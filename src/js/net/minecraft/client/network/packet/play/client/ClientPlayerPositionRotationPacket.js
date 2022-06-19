import ClientPlayerMovementPacket from "./ClientPlayerMovementPacket.js";

export default class ClientPlayerPositionRotationPacket extends ClientPlayerMovementPacket {

    constructor(onGround, x, y, z, yaw, pitch) {
        super(onGround);

        this.position = true;
        this.rotation = true;

        this.x = x;
        this.y = y;
        this.z = z;

        this.yaw = yaw;
        this.pitch = pitch;
    }
}