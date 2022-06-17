import ProtocolState from "./ProtocolState.js";
import HandshakePacket from "./packet/handshake/client/HandshakePacket.js";
import StatusQueryPacket from "./packet/status/client/StatusQueryPacket.js";
import LoginStartPacket from "./packet/login/client/LoginStartPacket.js";
import StatusResponsePacket from "./packet/status/server/StatusResponsePacket.js";
import EncryptionRequestPacket from "./packet/login/server/EncryptionRequestPacket.js";
import EncryptionResponsePacket from "./packet/login/client/EncryptionResponsePacket.js";
import LoginDisconnectPacket from "./packet/login/server/LoginDisconnectPacket.js";

export default class PacketRegistry {

    constructor() {
        this.packetsClient = [];
        this.packetsServer = [];

        // Register handshake
        this.registerClient(ProtocolState.HANDSHAKE, 0x00, HandshakePacket);

        // Register server status
        this.registerClient(ProtocolState.STATUS, 0x00, StatusQueryPacket);
        this.registerServer(ProtocolState.STATUS, 0x00, StatusResponsePacket);

        // Register login
        this.registerServer(ProtocolState.LOGIN, 0x00, LoginDisconnectPacket);
        this.registerServer(ProtocolState.LOGIN, 0x01, EncryptionRequestPacket);

        this.registerClient(ProtocolState.LOGIN, 0x00, LoginStartPacket);
        this.registerClient(ProtocolState.LOGIN, 0x01, EncryptionResponsePacket);
    }

    registerClient(state, id, packet) {
        this._register(this.packetsClient, state, id, packet);
    }

    registerServer(state, id, packet) {
        this._register(this.packetsServer, state, id, packet);
    }

    _register(registry, state, id, packet) {
        if (typeof registry[state] === "undefined") {
            registry[state] = [];
        }
        registry[state][id] = packet;
    }

    getServerBoundById(state, id) {
        if (typeof this.packetsServer[state][id] === "undefined") {
            return null;
        }
        return this.packetsServer[state][id];
    }

    getClientBoundById(state, id) {
        if (typeof this.packetsClient[state][id] === "undefined") {
            return null;
        }
        return this.packetsClient[state][id];
    }

    getClientBoundPacketId(state, packet) {
        for (let id in this.packetsClient[state]) {
            if (this.packetsClient[state][id] === packet.constructor) {
                return id;
            }
        }
        return null;
    }

    getServerBoundPacketId(state, packet) {
        for (let id in this.packetsServer[state]) {
            if (this.packetsServer[state][id] === packet.constructor) {
                return id;
            }
        }
        return null;
    }

    getPacketState(packet) {
        for (const [state, value] of Object.entries(this.packetsClient)) {
            for (let id in value) {
                if (value[id] === packet.constructor) {
                    return parseInt(state);
                }
            }
        }
        for (const [state, value] of Object.entries(this.packetsServer)) {
            for (let id in value) {
                if (value[id] === packet.constructor) {
                    return parseInt(state);
                }
            }
        }
        return null;
    }
}