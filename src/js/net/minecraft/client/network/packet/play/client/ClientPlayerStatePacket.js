import Packet from "../../../Packet.js";

export default class ClientPlayerStatePacket extends Packet {

    static START_SNEAKING = 0;
    static STOP_SNEAKING = 1;
    static STOP_SLEEPING = 2;
    static START_SPRINTING = 3;
    static STOP_SPRINTING = 4;
    static RIDING_JUMP = 5;
    static OPEN_INVENTORY = 6;

    constructor(entityId, state, jumpBoost = 0) {
        super();

        this.entityId = entityId;
        this.state = state;
        this.jumpBoost = jumpBoost;
    }

    write(buffer) {
        buffer.writeVarInt(this.entityId);
        buffer.writeByte(this.state);
        buffer.writeVarInt(this.jumpBoost);
    }
}