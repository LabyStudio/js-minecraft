import Packet from "../../../Packet.js";

export default class ServerConfirmTransactionPacket extends Packet {

    constructor() {
        super();

        this.windowId = 0;
        this.actionId = 0;
        this.accepted = false;
    }

    read(buffer) {
        this.windowId = buffer.readByte();
        this.actionId = buffer.readShort();
        this.accepted = buffer.readBoolean();
    }

    handle(handler) {
        handler.handleConfirmTransaction(this);
    }

    getWindowId() {
        return this.windowId;
    }

    getActionId() {
        return this.actionId;
    }

    isAccepted() {
        return this.accepted;
    }
}