import Packet from "../../../Packet.js";

export default class ClientConfirmTransactionPacket extends Packet {

    constructor(windowId, actionId, accepted) {
        super();

        this.windowId = windowId;
        this.actionId = actionId;
        this.accepted = accepted;
    }

    write(buffer) {
        buffer.writeByte(this.windowId);
        buffer.writeShort(this.actionId);
        buffer.writeByte(this.accepted ? 1 : 0);
    }
}