import Packet from "../../../Packet.js";
import BlockPosition from "../../../../../util/BlockPosition.js";
//https://wiki.vg/index.php?title=Protocol&oldid=7368#Held_Item_Change_2
export default class ClientHeldItemChangePacket extends Packet {

    constructor(slot) {
        super();

        this.slot=slot;
    }

    write(buffer) {
        buffer.writeShort(this.slot);
    }
}