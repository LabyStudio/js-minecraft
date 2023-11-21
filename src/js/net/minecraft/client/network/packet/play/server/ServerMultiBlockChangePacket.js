import Packet from "../../../Packet.js";

//https://wiki.vg/index.php?title=Protocol&oldid=7368#Multi_Block_Change
class BlockInfo{
    constructor(x,y,z,typeId,metaValue){
        this.x=x;
        this.y=y;
        this.z=z;
        this.typeId=typeId;
        this.metaValue=metaValue;
    }
}
export default class ServerMultiBlockChangePacket extends Packet {

    constructor() {
        super();

        this.chunk_x = 0
        this.chunk_z = 0;
        this.record_cnt=0;
        this.blockData = [];
    }

    read(buffer) {
        this.chunk_x = buffer.readInt();
        this.chunk_z = buffer.readInt();
        this.record_cnt=buffer.readVarInt();
        for (let i = 0; i <  this.record_cnt; i++) {
           let horrizontal_pos=buffer.readByte();
           let x=(horrizontal_pos&0xf0)>>4;
           let z=horrizontal_pos&0x0f;
           let y=buffer.readByte();
           let blockId=buffer.readVarInt();
           let typeId = blockId >> 4;
           let metaValue = blockId & 15;
           this.blockData.push(new BlockInfo((this.chunk_x<<4)+x,y,(this.chunk_z<<4)+z,typeId,metaValue));
        }
    }

    handle(handler) {
        handler.handleMultiBlockData(this);
    }

    getBlockData() {
        return this.blockData;
    }
}
