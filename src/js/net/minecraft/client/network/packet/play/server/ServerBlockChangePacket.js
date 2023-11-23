import Packet from "../../../Packet.js";
/*torch
| [Name](https://minecraft.wiki/w/Block_states) | Metadata Bits     | Default value | Allowed values                      | Values for Metadata Bits | Description                                                  |
| :-------------------------------------------- | ----------------- | ------------- | ----------------------------------- | ------------------------ | ------------------------------------------------------------ |
| **torch_facing_direction**                    | `0x1` `0x2` `0x4` | `west `       | `west` `east` `north` `south` `top` | `1` `2` `3` `4` `5`      | The face of the block that the torch is attached to. If the torch is a wall torch, the top of the torch faces opposite to this direction.[[2\]](https://minecraft.wiki/w/Torch#cite_note-6) |
| `unknown`                                     | `0`               | Unused        |                                     |                          |                                                              |


*/
export default class ServerBlockChangePacket extends Packet {

    constructor() {
        super();

        this.blockPosition = null;
    }

    read(buffer) {
        this.blockPosition = buffer.readBlockPosition();
        this.blockState = buffer.readVarInt();
    }

    handle(handler) {
        handler.handleBlockChange(this);
    }

    getBlockPosition() {
        return this.blockPosition;
    }

    getBlockState() {
        return this.blockState;
    }
}