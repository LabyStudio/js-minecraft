import Packet from "../../../Packet.js";
import BlockPosition from "../../../../../util/BlockPosition.js";

export default class ClientBlockPlacementPacket extends Packet {

    constructor(x,y,z,face,helditem,cursorx,cursory,cursorz) {
        super();
        this.position=new BlockPosition(x,y,z)
        this.face = face;
        this.present=1;
        this.itemid=helditem;
        this.count=1;
        this.nbt=0;
        this.cursorx=cursorx;
        this.cursory=cursory;
        this.cursorz=cursorz;
    }

    write(buffer) {
        buffer.writeLong(this.position.toLong())
        buffer.writeByte(this.face);
        buffer.writeByte(this.present);
        buffer.writeByte(this.itemid);
        buffer.writeByte(this.count);
        buffer.writeByte(this.nbt);
        buffer.writeByte(this.cursorx);
        buffer.writeByte(this.cursory);
        buffer.writeByte(this.cursorz);
    }
}