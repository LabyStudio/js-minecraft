import Random from "../../../util/Random.js";
import ByteBuf from "./ByteBuf.js";
import {require} from "../../../../../Start.js";

export default class CryptManager {

    static createNewSharedKey() {
        let key = new Uint8Array(16);
        window.crypto.getRandomValues(key);
        return key;
    }

    static encryptRSA(publicKey, data) {
        // Parse asn1 public key
        let asn1 = require("ASN1").parse(new Uint8Array(publicKey))
        let bigintModArith = require("bigint-mod-arith");

        // Extract n and e of the public key
        let n = bigintModArith.bytesToBigInt(asn1.children[1].children[0].children[0].value);
        let e = bigintModArith.bytesToBigInt(asn1.children[1].children[0].children[1].value);

        // Check length of public key
        let length = (n.toString(2).length + 7) >> 3;
        if (length < data.length + 11) {
            throw new Error("Data is too long to encrypt");
        }

        let buffer = new ByteBuf(new Uint8Array(data).reverse());
        buffer.setPosition(buffer.length());

        // Add padding
        buffer.writeByte(0x0);
        let random = new Random();
        let x = [];
        while (buffer.length() < length - 2) {
            x[0] = 0;
            while (x[0] === 0) random.nextBytes(x, x.length);
            buffer.writeByte(x[0]);
        }
        buffer.writeByte(0x2);
        buffer.writeByte(0x0);

        // Reverse data
        let reversed = buffer.getArray().reverse();

        // Convert to bigint
        let bigInt = bigintModArith.bytesToBigInt(reversed);

        // Encrypt
        bigInt = bigintModArith.modPow(bigInt, e, n);

        // Convert to bytes
        return bigintModArith.bigIntToBytes(bigInt);
    }

}