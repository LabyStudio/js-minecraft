import ServerEntityMovementPacket from "./ServerEntityMovementPacket.js";

export default class ServerEntityRotationPacket extends ServerEntityMovementPacket {

    constructor() {
        super();

        this.rotation = true;
    }
}