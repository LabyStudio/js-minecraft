import Packet from "../../../Packet.js";
import CryptManager from "../../../util/CryptManager.js";

export default class EncryptionResponsePacket extends Packet {

    constructor(secretKey, publicKey, verifyToken) {
        super();

        this.secretKeyEncrypted = CryptManager.encryptRSA(publicKey, secretKey);
        this.verifyTokenEncrypted = CryptManager.encryptRSA(publicKey, verifyToken);
    }

    write(buffer) {
        buffer.writeByteArray(this.secretKeyEncrypted);
        buffer.writeByteArray(this.verifyTokenEncrypted);
    }

    read(buffer) {

    }

}