import Packet from "../../../Packet.js";

export default class ServerAnimationPacket extends Packet {

    static SWING_ARM = 0;
    static DAMAGE = 1;
    static LEAVE_BED = 2;
    static EAT_FOOD = 3;
    static CRITICAL_HIT = 4;
    static ENCHANTMENT_CRITICAL_HIT = 5;

    constructor() {
        super();

        this.entityId = 0;
        this.animation = 0;
    }

    read(buffer) {
        this.entityId = buffer.readVarInt();
        this.animation = buffer.readByte();
    }

    handle(handler) {
        handler.handleAnimation(this);
    }

    getEntityId() {
        return this.entityId;
    }

    getAnimation() {
        return this.animation;
    }
}