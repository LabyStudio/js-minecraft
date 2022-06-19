import Packet from "../../../Packet.js";

export default class ServerPlayerListDataPacket extends Packet {

    constructor() {
        super();

        this.header = null;
        this.footer = null;
    }

    read(buffer) {
        this.header = buffer.readTextComponent();
        this.footer = buffer.readTextComponent();
    }

    handle(handler) {
        handler.handleServerPlayerListData(this);
    }

    getHeader() {
        return this.header;
    }

    getFooter() {
        return this.footer;
    }
}