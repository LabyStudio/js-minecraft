import PacketHandler from "../PacketHandler.js";
import EncryptionResponsePacket from "../packet/login/client/EncryptionResponsePacket.js";
import CryptManager from "../util/CryptManager.js";
import GuiDisconnected from "../../gui/screens/GuiDisconnected.js";

export default class NetworkLoginHandler extends PacketHandler {

    constructor(networkManager) {
        super();

        this.networkManager = networkManager;
    }

    handleEncryptionRequest(packet) {
        let secretKey = CryptManager.createNewSharedKey();
        this.networkManager.sendPacket(new EncryptionResponsePacket(secretKey, packet.publicKey, packet.verifyToken));

        // Enable encryption
        this.networkManager.enableEncryption(secretKey);
    }

    handleLoginDisconnect(packet) {
        console.log("[Network] Disconnected from server: " + packet.message);
        this.networkManager.minecraft.displayScreen(new GuiDisconnected(packet.message));
    }

    onDisconnect() {

    }

}