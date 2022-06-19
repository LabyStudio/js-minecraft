import ClientPlayerMovementPacket from "./ClientPlayerMovementPacket.js";

export default class ClientPlayerRotationPacket extends ClientPlayerMovementPacket {

    constructor(onGround, yaw, pitch) {
        super(onGround);

        this.rotation = true;

        this.yaw = yaw;
        this.pitch = pitch;
    }
}