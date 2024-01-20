import Packet from "../../../Packet.js";
//https://wiki.vg/index.php?title=Protocol&oldid=7368#Held_Item_Change
export default class ServerHeldItemChangePacket extends Packet {

    constructor() {
        super();

        this.slot =0;//0-8
    }

    read(buffer) {
        this.slot = buffer.readByte();
    }

    handle(handler) {
        handler.handleHeldItemChange(this);
    }
    getSlot(){
        return this.slot;
    }
}