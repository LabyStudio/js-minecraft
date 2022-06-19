import Long from "../../../../../libraries/long.js";
import Random from "./Random.js";

export default class UUID {

    constructor(msb, lsb) {
        this.mostSigBits = msb;
        this.leastSigBits = lsb;
    }

    toString() {
        return (UUID.digits(this.mostSigBits.shiftRightUnsigned(32), 8) + "-" +
            UUID.digits(this.mostSigBits.shiftRightUnsigned(16), 4) + "-" +
            UUID.digits(this.mostSigBits, 4) + "-" +
            UUID.digits(this.leastSigBits.shiftRightUnsigned(48), 4) + "-" +
            UUID.digits(this.leastSigBits, 12));
    }

    getMostSignificantBits() {
        return this.mostSigBits;
    }

    getLeastSignificantBits() {
        return this.leastSigBits;
    }

    static randomUUID() {
        let random = new Random();

        let randomBytes = [];
        random.nextBytes(randomBytes, 16);
        randomBytes[6] &= 0x0f;  /* clear version        */
        randomBytes[6] |= 0x40;  /* set to version 4     */
        randomBytes[8] &= 0x3f;  /* clear variant        */
        randomBytes[8] |= 0x80;  /* set to IETF variant  */
        return UUID.fromBytes(randomBytes);
    }

    static digits(val, digits) {
        let hi = Long.fromInt(1).shiftLeft(Long.fromInt(digits).multiply(4));
        let num = hi.or(val.and(hi.add(Long.fromInt(-1))));
        return num.toString(16).substr(1);
    }

    static fromString(string) {
        let components = string.split("-");
        if (components.length !== 5) {
            throw new Error("Invalid UUID string: " + string);
        }

        for (let i = 0; i < 5; i++) {
            components[i] = parseInt(components[i], 16);
        }

        let mostSigBits = Long.fromNumber(components[0]);
        mostSigBits = mostSigBits.shiftLeft(16);
        mostSigBits = mostSigBits.or(Long.fromNumber(components[1]));
        mostSigBits = mostSigBits.shiftLeft(16);
        mostSigBits = mostSigBits.or(Long.fromNumber(components[2]));

        let leastSigBits = Long.fromInt(components[3]);
        leastSigBits = leastSigBits.shiftLeft(48);
        leastSigBits = leastSigBits.or(Long.fromNumber(components[4]));

        return new UUID(mostSigBits, leastSigBits);
    }

    static fromBytes(data) {
        let msb = Long.fromNumber(0);
        let lsb = Long.fromNumber(0);
        for (let i = 0; i < 8; i++) {
            msb = msb.shiftLeft(8).or(Long.fromInt(data[i] & 0xff));
        }
        for (let i = 8; i < 16; i++) {
            lsb = lsb.shiftLeft(8).or(Long.fromInt(data[i] & 0xff));
        }
        return new UUID(msb, lsb);
    }
}