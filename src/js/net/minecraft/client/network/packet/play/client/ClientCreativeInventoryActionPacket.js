import Packet from "../../../Packet.js";
//https://wiki.vg/index.php?title=Protocol&oldid=7368#Creative_Inventory_Action
//https://wiki.vg/index.php?title=Slot_Data&oldid=7094
//https://wiki.vg/index.php?title=Slot_Data&oldid=7835
export default class ClientCreativeInventoryActionPacket extends Packet {

    constructor(slot,selecteditem) {
        super();
        this.slot=slot+0x24;
        this.itemid=selecteditem;//typically 1
        this.itemcount=1;
        this.itemdamage=0;//contains 0-8 slot
        this.nbt=0;
    }

    write(buffer) {
        buffer.writeShort(this.slot);//slot is the slot in the inventory numbers around 20
        //item
        buffer.writeShort(this.itemid);
        buffer.writeByte(this.itemcount);
        buffer.writeShort(this.itemdamage);
        buffer.writeByte(this.nbt);
    }
}