import Long from "../../../../../libraries/long.js";
import Random from "./Random.js";

export default class UUID {

    constructor(data) {
        let msb = Long.fromNumber(0);
        let lsb = Long.fromNumber(0);
        for (let i = 0; i < 8; i++) {
            msb = msb.shiftLeft(8).or(Long.fromInt(data[i] & 0xff));
        }
        for (let i = 8; i < 16; i++) {
            lsb = lsb.shiftLeft(8).or(Long.fromInt(data[i] & 0xff));
        }
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

    static randomUUID() {
        let random = new Random();

        let randomBytes = [];
        random.nextBytes(randomBytes, 16);
        randomBytes[6] &= 0x0f;  /* clear version        */
        randomBytes[6] |= 0x40;  /* set to version 4     */
        randomBytes[8] &= 0x3f;  /* clear variant        */
        randomBytes[8] |= 0x80;  /* set to IETF variant  */
        return new UUID(randomBytes);
    }

    static digits(val, digits) {
        let hi = Long.fromInt(1).shiftLeft(Long.fromInt(digits).multiply(4));
        let num = hi.or(val.and(hi.add(Long.fromInt(-1))));
        return num.toString(16).substr(1);
    }
}