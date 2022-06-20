import ServerEntityMovementPacket from "./ServerEntityMovementPacket.js";

export default class ServerEntityPositionPacket extends ServerEntityMovementPacket {

    constructor() {
        super();

        this.position = true;
    }
}