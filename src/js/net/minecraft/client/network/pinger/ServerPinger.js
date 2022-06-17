import NetworkManager from "../NetworkManager.js";
import NetworkStatusHandler from "./NetworkStatusHandler.js";
import Minecraft from "../../Minecraft.js";
import HandshakePacket from "../packet/handshake/client/HandshakePacket.js";
import ProtocolState from "../ProtocolState.js";
import StatusQueryPacket from "../packet/status/client/StatusQueryPacket.js";

export default class ServerPinger {

    constructor(minecraft) {
        this.minecraft = minecraft;
    }

    ping(address, port, callback) {
        // Connect to server
        this.connection = new NetworkManager(this.minecraft);
        this.connection.setNetworkHandler(new NetworkStatusHandler(this.minecraft, callback));
        this.connection.connect(address, port, Minecraft.PROXY);

        // Request status
        this.connection.sendPacket(new HandshakePacket(Minecraft.PROTOCOL_VERSION, ProtocolState.STATUS));
        this.connection.sendPacket(new StatusQueryPacket());
    }


}