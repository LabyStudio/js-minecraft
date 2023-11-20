import Packet from "../../../Packet.js";
import BlockPosition from "../../../../../util/BlockPosition.js";
//https://wiki.vg/index.php?title=Protocol&oldid=7368#Player_Block_Placement
//https://wiki.vg/index.php?title=Slot_Data&oldid=7094
//https://wiki.vg/index.php?title=Slot_Data&oldid=7835
export default class ClientPlayerBlockPlacementPacket extends Packet {

    constructor(x,y,z,face,helditem,cursorx,cursory,cursorz,dataValue=0) {
        super();
        this.position=new BlockPosition(x,y,z)
        this.face = face;
        this.itemid=helditem;
        this.itemcount=1;
        this.itemdamage=dataValue;
        this.nbt=0;
        this.cursorx=cursorx;
        this.cursory=cursory;
        this.cursorz=cursorz;
    }

    write(buffer) {
        buffer.writeLong(this.position.toLong())
        buffer.writeByte(this.face);
        buffer.writeShort(this.itemid);
        buffer.writeByte(this.itemcount);
        buffer.writeShort(this.itemdamage);
        buffer.writeByte(this.nbt);
        buffer.writeByte(this.cursorx);
        buffer.writeByte(this.cursory);
        buffer.writeByte(this.cursorz);
    }
}