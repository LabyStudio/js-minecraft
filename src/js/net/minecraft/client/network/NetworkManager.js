import ByteBuf from "./util/ByteBuf.js";
import PacketRegistry from "./PacketRegistry.js";
import ProtocolState from "./ProtocolState.js";
import {aesjs} from "../../../../../../libraries/aes.js";

export default class NetworkManager {

    constructor(minecraft) {
        this.minecraft = minecraft;
        this.socket = null;
        this.connected = false;
        this.networkHandler = null;

        this.registry = new PacketRegistry();
        this.protocolState = ProtocolState.HANDSHAKE;

        this.readBuffer = new ByteBuf();
        this.expectedLength = -1;

        this.queue = [];
    }

    setNetworkHandler(networkHandler) {
        this.networkHandler = networkHandler;
    }

    connect(address, port, proxy) {
        this.socket = new WebSocket("ws://" + proxy.address + ":" + proxy.port);
        this.socket.binaryType = "arraybuffer";

        this.socket.onopen = e => this._onOpen(e);
        this.socket.onclose = e => this._onClose(e);
        this.socket.onmessage = e => this._onMessage(e);
        this.socket.onerror = e => this._onError(e);

        this.address = address;
        this.port = port;
    }

    _onOpen() {
        this.connected = true;

        // Send proxy handshake
        let object = {
            "address": this.address,
            "port": this.port,
        };
        this.socket.send(JSON.stringify(object));

        // Handle connect event
        this.networkHandler.onConnect();

        // Flush packet queue
        this.flushPacketQueue();
    }

    sendPacket(packet) {
        if (this.connected) {
            this._sendPacketImmediately(packet);
        } else {
            this.queue.push(packet);
        }
    }

    _sendPacketImmediately(packet) {
        // Switch packet state
        let packetState = this.registry.getPacketState(packet);
        if (packetState !== this.protocolState) {
            if (packetState === null) {
                console.error("[Network] Tried to send unknown packet: " + packet);
                return;
            }

            console.log("[Network] Switching protocol state from " + ProtocolState.getName(this.protocolState) + " to " + ProtocolState.getName(packetState));
            this.protocolState = packetState;
        }

        // Write packet to buffer
        let buffer = new ByteBuf();
        buffer.writeByte(this.registry.getClientBoundPacketId(this.protocolState, packet));
        packet.write(buffer);

        // Write chunk header
        let array = buffer.getArray();
        let wrapper = new ByteBuf();
        wrapper.writeVarInt(array.length);
        wrapper.write(array);
        let chunk = wrapper.getArray().buffer;

        // Encrypt chunk
        if (this.isEncrypted) {
            chunk = this.encryption.encrypt(new Uint8Array(chunk));
        }

        // Send chunk
        this.socket.send(chunk);

        console.log("[Network] [OUT] " + packet.constructor.name);
    }

    _onMessage(event) {
        let chunk = new Int8Array(event.data);

        // Decrypt chunk
        if (this.isEncrypted) {
            chunk = this.encryption.decrypt(new Uint8Array(event.data));
        }

        // Read packet header
        if (this.expectedLength === -1) {
            let buf = new ByteBuf(chunk);
            this.expectedLength = buf.readVarInt(); // Read packet length
            this.readBuffer.setPosition(0);
            chunk = chunk.slice(buf.getPosition());
        }

        // Fill packet content
        this.readBuffer.write(chunk);

        // Handle packet
        if (this.readBuffer.getPosition() >= this.expectedLength) {
            this.expectedLength = -1;
            this.readBuffer.setPosition(0);
            this.onPacketBufferReceived(this.readBuffer);
        }
    }

    onPacketBufferReceived(buffer) {
        let packetId = buffer.readByte(); // Read packet id
        let clazz = this.registry.getServerBoundById(this.protocolState, packetId);
        if (clazz === null) {
            console.log("[Network] Unknown packet id: " + packetId);
            return;
        }

        let packet = new clazz;
        console.log("[Network] [IN] " + packet.constructor.name);

        packet.read(buffer, buffer.length);
        packet.handle(this.networkHandler);
    }

    _onError(event) {

    }

    _onClose(event) {
        if (this.connected) {
            this.networkHandler.onDisconnect("Disconnected from server");
        }

        this.connected = false;
    }

    close() {
        this.connected = false;
        this.socket.close();
    }

    flushPacketQueue() {
        this.queue.forEach(packet => this.sendPacket(packet));
        this.queue = [];
    }

    enableEncryption(secretKey) {
        this.isEncrypted = true;
        this.encryption = new aesjs.ModeOfOperation.cfb(secretKey, secretKey, 1);
    }
}