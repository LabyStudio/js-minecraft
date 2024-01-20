import Packet from "../../../Packet.js";
import BlockPosition from "../../../../../util/BlockPosition.js";
//https://wiki.vg/index.php?title=Protocol&oldid=7368#Player_Digging
export default class ClientPlayerDiggingPacket extends Packet {

    constructor(status,x,y,z,face) {
        super();

        this.status = status;
        this.position=new BlockPosition(x,y,z)
        this.face = face;
    }

    write(buffer) {
        buffer.writeByte(this.status);
        buffer.writeLong(this.position.toLong())
        buffer.writeByte(this.face);
    }
}