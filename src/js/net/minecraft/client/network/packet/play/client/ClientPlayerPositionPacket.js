import ClientPlayerMovementPacket from "./ClientPlayerMovementPacket.js";

export default class ClientPlayerPositionPacket extends ClientPlayerMovementPacket {

    constructor(onGround, x, y, z) {
        super(onGround);

        this.position = true;

        this.x = x;
        this.y = y;
        this.z = z;
    }
}