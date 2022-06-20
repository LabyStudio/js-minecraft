import ProtocolState from "./ProtocolState.js";
import HandshakePacket from "./packet/handshake/client/HandshakePacket.js";
import StatusQueryPacket from "./packet/status/client/StatusQueryPacket.js";
import LoginStartPacket from "./packet/login/client/LoginStartPacket.js";
import StatusResponsePacket from "./packet/status/server/StatusResponsePacket.js";
import EncryptionRequestPacket from "./packet/login/server/EncryptionRequestPacket.js";
import EncryptionResponsePacket from "./packet/login/client/EncryptionResponsePacket.js";
import LoginDisconnectPacket from "./packet/login/server/LoginDisconnectPacket.js";
import LoginSuccessPacket from "./packet/login/server/LoginSuccessPacket.js";
import EnableCompressionPacket from "./packet/login/server/EnableCompressionPacket.js";
import ServerKeepAlivePacket from "./packet/play/server/ServerKeepAlivePacket.js";
import ServerJoinGamePacket from "./packet/play/server/ServerJoinGamePacket.js";
import ClientKeepAlivePacket from "./packet/play/client/ClientKeepAlivePacket.js";
import ClientChatPacket from "./packet/play/client/ClientChatPacket.js";
import ClientPlayerMovementPacket from "./packet/play/client/ClientPlayerMovementPacket.js";
import ClientPlayerRotationPacket from "./packet/play/client/ClientPlayerRotationPacket.js";
import ClientPlayerPositionPacket from "./packet/play/client/ClientPlayerPositionPacket.js";
import ClientPlayerPositionRotationPacket from "./packet/play/client/ClientPlayerPositionRotationPacket.js";
import ServerChunkDataPacket from "./packet/play/server/ServerChunkDataPacket.js";
import ServerMultiChunkDataPacket from "./packet/play/server/ServerMultiChunkDataPacket.js";
import ServerBlockChangePacket from "./packet/play/server/ServerBlockChangePacket.js";
import ServerChatPacket from "./packet/play/server/ServerChatPacket.js";
import ServerDisconnectPacket from "./packet/play/server/ServerDisconnectPacket.js";
import ServerPlayerPositionRotationPacket from "./packet/play/server/ServerPlayerPositionRotationPacket.js";
import ServerPlayerListEntryPacket from "./packet/play/server/ServerPlayerListEntryPacket.js";
import ServerPlayerListDataPacket from "./packet/play/server/ServerPlayerListDataPacket.js";
import ServerSpawnPlayerPacket from "./packet/play/server/ServerSpawnPlayerPacket.js";
import ServerEntityPositionRotationPacket from "./packet/play/server/ServerEntityPositionRotationPacket.js";
import ServerEntityMovementPacket from "./packet/play/server/ServerEntityMovementPacket.js";
import ServerEntityRotationPacket from "./packet/play/server/ServerEntityRotationPacket.js";
import ServerEntityPositionPacket from "./packet/play/server/ServerEntityPositionPacket.js";
import ServerEntityTeleportPacket from "./packet/play/server/ServerEntityTeleportPacket.js";
import ServerDestroyEntitiesPacket from "./packet/play/server/ServerDestroyEntitiesPacket.js";
import ServerEntityHeadLookPacket from "./packet/play/server/ServerEntityHeadLookPacket.js";
import ClientPlayerStatePacket from "./packet/play/client/ClientPlayerStatePacket.js";
import ClientSwingArmPacket from "./packet/play/client/ClientSwingArmPacket.js";
import ServerAnimationPacket from "./packet/play/server/ServerAnimationPacket.js";
import ServerEntityMetadataPacket from "./packet/play/server/ServerEntityMetadataPacket.js";
import ServerConfirmTransactionPacket from "./packet/play/server/ServerConfirmTransactionPacket.js";
import ClientConfirmTransactionPacket from "./packet/play/client/ClientConfirmTransactionPacket.js";

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
        this.registerServer(ProtocolState.LOGIN, 0x02, LoginSuccessPacket);
        this.registerServer(ProtocolState.LOGIN, 0x03, EnableCompressionPacket);

        this.registerClient(ProtocolState.LOGIN, 0x00, LoginStartPacket);
        this.registerClient(ProtocolState.LOGIN, 0x01, EncryptionResponsePacket);

        // Register play
        this.registerServer(ProtocolState.PLAY, 0x00, ServerKeepAlivePacket);
        this.registerServer(ProtocolState.PLAY, 0x01, ServerJoinGamePacket);
        this.registerServer(ProtocolState.PLAY, 0x02, ServerChatPacket);
        this.registerServer(ProtocolState.PLAY, 0x08, ServerPlayerPositionRotationPacket);
        this.registerServer(ProtocolState.PLAY, 0x0B, ServerAnimationPacket);
        this.registerServer(ProtocolState.PLAY, 0x0C, ServerSpawnPlayerPacket);
        this.registerServer(ProtocolState.PLAY, 0x13, ServerDestroyEntitiesPacket);
        this.registerServer(ProtocolState.PLAY, 0x14, ServerEntityMovementPacket);
        this.registerServer(ProtocolState.PLAY, 0x15, ServerEntityPositionPacket);
        this.registerServer(ProtocolState.PLAY, 0x16, ServerEntityRotationPacket);
        this.registerServer(ProtocolState.PLAY, 0x17, ServerEntityPositionRotationPacket);
        this.registerServer(ProtocolState.PLAY, 0x18, ServerEntityTeleportPacket);
        this.registerServer(ProtocolState.PLAY, 0x19, ServerEntityHeadLookPacket);
        this.registerServer(ProtocolState.PLAY, 0x1C, ServerEntityMetadataPacket);
        this.registerServer(ProtocolState.PLAY, 0x21, ServerChunkDataPacket);
        this.registerServer(ProtocolState.PLAY, 0x23, ServerBlockChangePacket);
        this.registerServer(ProtocolState.PLAY, 0x26, ServerMultiChunkDataPacket);
        this.registerServer(ProtocolState.PLAY, 0x32, ServerConfirmTransactionPacket);
        this.registerServer(ProtocolState.PLAY, 0x38, ServerPlayerListEntryPacket);
        this.registerServer(ProtocolState.PLAY, 0x40, ServerDisconnectPacket);
        this.registerServer(ProtocolState.PLAY, 0x47, ServerPlayerListDataPacket);

        this.registerClient(ProtocolState.PLAY, 0x00, ClientKeepAlivePacket);
        this.registerClient(ProtocolState.PLAY, 0x01, ClientChatPacket);
        this.registerClient(ProtocolState.PLAY, 0x03, ClientPlayerMovementPacket);
        this.registerClient(ProtocolState.PLAY, 0x04, ClientPlayerPositionPacket);
        this.registerClient(ProtocolState.PLAY, 0x05, ClientPlayerRotationPacket);
        this.registerClient(ProtocolState.PLAY, 0x06, ClientPlayerPositionRotationPacket);
        this.registerClient(ProtocolState.PLAY, 0x0A, ClientSwingArmPacket);
        this.registerClient(ProtocolState.PLAY, 0x0B, ClientPlayerStatePacket);
        this.registerClient(ProtocolState.PLAY, 0x0F, ClientConfirmTransactionPacket);
    }

    registerClient(state, id, packet) {
        this._register(this.packetsClient, state, id, packet);
    }

    registerServer(state, id, packet) {
        this._register(this.packetsServer, state, id, packet);
    }

    _register(registry, state, id, packet) {
        if (typeof registry[state.getId()] === "undefined") {
            registry[state.getId()] = [];
        }
        registry[state.getId()][id] = packet;
    }

    getServerBoundById(state, id) {
        if (typeof this.packetsServer[state.getId()][id] === "undefined") {
            return null;
        }
        return this.packetsServer[state.getId()][id];
    }

    getClientBoundById(state, id) {
        if (typeof this.packetsClient[state.getId()][id] === "undefined") {
            return null;
        }
        return this.packetsClient[state.getId()][id];
    }

    getClientBoundPacketId(state, packet) {
        for (let id in this.packetsClient[state.getId()]) {
            if (this.packetsClient[state.getId()][id] === packet.constructor) {
                return id;
            }
        }
        return null;
    }

    getServerBoundPacketId(state, packet) {
        for (let id in this.packetsServer[state]) {
            if (this.packetsServer[state.getId()][id] === packet.constructor) {
                return id;
            }
        }
        return null;
    }

    getPacketState(packet) {
        for (const [state, value] of Object.entries(this.packetsClient)) {
            for (let id in value) {
                if (value[id] === packet.constructor) {
                    return ProtocolState.fromId(parseInt(state));
                }
            }
        }
        for (const [state, value] of Object.entries(this.packetsServer)) {
            for (let id in value) {
                if (value[id] === packet.constructor) {
                    return ProtocolState.fromId(parseInt(state));
                }
            }
        }
        return null;
    }
}