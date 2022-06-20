import ByteBuf from "./util/ByteBuf.js";
import PacketRegistry from "./PacketRegistry.js";
import ProtocolState from "./ProtocolState.js";
import {require} from "../../../../Start.js";
import MissingPackets from "../../util/MissingPackets.js";

export default class NetworkManager {

    static DEBUG = false;
    static MAX_COMPRESSION = 2097152;

    constructor(minecraft) {
        this.minecraft = minecraft;
        this.socket = null;
        this.connected = false;
        this.networkHandler = null;

        this.registry = new PacketRegistry();
        this.protocolState = ProtocolState.HANDSHAKE;

        this.queue = [];

        this.pako = require("pako");
        this.compressionThreshold = 0;

        this.carryBuffer = [];
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
        this.sendProxyPacket(0, {
            "host": this.address,
            "port": this.port,
        });

        // Handle connect event
        this.networkHandler.onConnect();

        // Flush packet queue
        this.flushPacketQueue();
    }

    sendProxyPacket(id, payload) {
        let object = {
            "id": id,
            "payload": payload
        };
        this.socket.send(JSON.stringify(object));
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
                console.error("[Network] Tried to send unknown packet: " + packet.constructor.name);
                return;
            }

            this.setState(packetState);
        }

        // Packet Codec
        let buffer = new ByteBuf();
        buffer.writeByte(this.registry.getClientBoundPacketId(this.protocolState, packet));
        packet.write(buffer);
        buffer.setPosition(0);

        // Packet Compression
        if (this.compressionThreshold !== 0) {
            let length = buffer.length();
            if (length > this.compressionThreshold) {
                let compressed = this.pako.deflate(buffer.getArray(), {
                    chunkSize: 8192
                });

                buffer = new ByteBuf();
                buffer.writeVarInt(length);
                buffer.write(compressed);
            } else {
                let copy = buffer.getArray();
                buffer = new ByteBuf();
                buffer.writeVarInt(0);
                buffer.write(copy);
            }
            buffer.setPosition(0);
        }

        // Packet Sizer
        let wrapper = new ByteBuf();
        wrapper.writeVarInt(buffer.length());
        wrapper.write(buffer.getArray());

        // Packet Compression
        if (this.isEncrypted) {
            wrapper = new ByteBuf(this.encryption.encrypt(wrapper.getArray()));
        }

        // Send chunk
        this.socket.send(wrapper.getArray());

        if (NetworkManager.DEBUG) {
            console.log("[Network] [OUT] " + packet.constructor.name);
        }
    }

    _onMessage(event) {
        try {
            let data = new Uint8Array(event.data);

            // Packet Compression
            if (this.isEncrypted) {
                data = this.decryption.decrypt(data);
            }

            // Packet Sizer

            let bufferIn = new ByteBuf(new Int8Array([]));
            bufferIn.write(this.carryBuffer);
            bufferIn.write(data);
            bufferIn.setPosition(0);
            this.carryBuffer = [];
            while (bufferIn.readableBytes() > 0) {
                let three = [0, 0, 0];
                let start = bufferIn.getPosition();
                for (let i = 0; i < three.length; i++) {
                    three[i] = bufferIn.readByte();
                    if (three[i] >= 0) {
                        let length = new ByteBuf(three).readVarInt();
                        if (length === 0) {
                            throw new Error("Empty Packet!");
                        }

                        if (bufferIn.readableBytes() < length) {
                            bufferIn.setPosition(start);
                            this.carryBuffer = bufferIn.getSlicedArray();
                            return;
                        } else {
                            this.handlePacket(new ByteBuf(bufferIn.getSlicedArray(length)));
                            bufferIn.skipBytes(length);
                        }
                        break;
                    }
                }
            }
        } catch (e) {
            console.error(e);
            console.log(e.stack);
        }
    }

    handlePacket(buffer) {
        // Packet Compression
        if (this.compressionThreshold !== 0) {
            let uncompressedLength = buffer.readVarInt();

            if (uncompressedLength !== 0) {
                if (uncompressedLength < this.compressionThreshold) {
                    throw new Error("Badly compressed packet - size of " + uncompressedLength + " is below server threshold of " + this.compressionThreshold);
                }
                if (uncompressedLength > NetworkManager.MAX_COMPRESSION) {
                    throw new Error("Badly compressed packet - size of " + uncompressedLength + " is larger than protocol maximum of " + NetworkManager.MAX_COMPRESSION);
                }

                // Decompress
                buffer = new ByteBuf(this.pako.inflate(new Uint8Array(buffer.getSlicedArray()), {
                    chunkSize: 8192
                }));

                if (buffer.length() !== uncompressedLength) {
                    throw new Error("Badly compressed packet - decompressed size of " + buffer.length() + " is not equal to original size of " + uncompressedLength);
                }
            }
        }

        // Packet Codec
        let packetId = buffer.readByte(); // Read packet id
        let clazz = this.registry.getServerBoundById(this.protocolState, packetId);
        if (clazz === null) {
            if (NetworkManager.DEBUG) {
                console.log("[Network] [IN] Unknown packet id: " + packetId + " (0x" + packetId.toString(16) + ") (" + new MissingPackets().get(packetId) + ")");
            }
            return;
        } else {
            if (NetworkManager.DEBUG) {
                console.log("[Network] [IN] " + clazz.name);
            }
        }

        let packet = new clazz;
        packet.read(buffer, buffer.length);
        packet.handle(this.networkHandler);
    }

    _onError(event) {
        console.error("[Network] Error: " + event.data);
    }

    _onClose(event) {
        if (this.connected) {
            this.networkHandler.onDisconnect();
        }

        this.connected = false;
    }

    close() {
        this.connected = false;
        this.socket.close();
        this.networkHandler.onDisconnect();
    }

    isConnected() {
        return this.connected;
    }

    flushPacketQueue() {
        this.queue.forEach(packet => this.sendPacket(packet));
        this.queue = [];
    }

    enableEncryption(secretKey) {
        this.isEncrypted = true;
        this.decryption = new (require("aesjs").ModeOfOperation).cfb(secretKey, secretKey, 1);
        this.encryption = new (require("aesjs").ModeOfOperation).cfb(secretKey, secretKey, 1);
    }

    setState(packetState) {
        console.log("[Network] Switching protocol state from " + this.protocolState.getName() + " to " + packetState.getName());
        this.protocolState = packetState;
    }

    getState() {
        return this.protocolState;
    }

    setCompressionThreshold(threshold) {
        console.log("[Network] Set compression threshold to " + threshold);

        if (threshold >= 0) {
            this.compressionThreshold = threshold;
        } else {
            this.compressionThreshold = 0;
        }
    }
}