import Packet from "../../../Packet.js";
import UUID from "../../../../../util/UUID.js";
import GameProfile from "../../../../../util/GameProfile.js";

export default class LoginSuccessPacket extends Packet {

    constructor() {
        super();

        this.profile = null;
    }

    write(buffer) {

    }

    read(buffer) {
        let uuid = UUID.fromString(buffer.readString());
        let username = buffer.readString();

        this.profile = new GameProfile(uuid, username);
    }

    handle(handler) {
        handler.handleLoginSuccess(this);
    }
}