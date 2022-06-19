import PacketHandler from "./PacketHandler.js";
import EncryptionResponsePacket from "../packet/login/client/EncryptionResponsePacket.js";
import CryptManager from "../util/CryptManager.js";
import GuiDisconnected from "../../gui/screens/GuiDisconnected.js";
import Authentication from "../util/Authentication.js";
import NetworkPlayHandler from "./NetworkPlayHandler.js";
import ProtocolState from "../ProtocolState.js";

export default class NetworkLoginHandler extends PacketHandler {

    constructor(networkManager) {
        super();

        this.networkManager = networkManager;
        this.authentication = new Authentication(networkManager);
    }

    handleEncryptionRequest(packet) {
        // Create an AES key for the packet encryption
        let secretKey = CryptManager.createNewSharedKey();

        // Send join server request to Mojang
        let session = this.networkManager.minecraft.getSession();
        let serverId = this.authentication.createServerHash(packet.serverId, secretKey, packet.publicKey);
        this.authentication.joinServer(session.getProfile(), session.getAccessToken(), serverId);

        // Send encryption response
        this.networkManager.sendPacket(new EncryptionResponsePacket(secretKey, packet.publicKey, packet.verifyToken));

        // Enable encryption
        this.networkManager.enableEncryption(secretKey);
    }

    handleLoginDisconnect(packet) {
        console.log("[Network] Disconnected from server: " + packet.message);
        this.networkManager.minecraft.displayScreen(new GuiDisconnected(packet.message));
    }

    handleLoginSuccess(packet) {
        this.networkManager.setState(ProtocolState.PLAY);
        this.networkManager.setNetworkHandler(new NetworkPlayHandler(this.networkManager, packet.profile));
    }

    handleEnableCompression(packet) {
        this.networkManager.setCompressionThreshold(packet.getCompressionThreshold());
    }

    onDisconnect() {
        if (this.networkManager.minecraft.isInGame()) {
            this.networkManager.minecraft.displayScreen(new GuiDisconnected("Disconnected from server"));
        }
    }

}