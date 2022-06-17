import Long from "../../../../../libraries/long.js";

export default class Random {

    static instances = 0;

    constructor(seed = Date.now() % 1000000000 ^ Random.instances++ * 1000) {
        this.multiplier = Long.fromString("25214903917");
        this.mask = Long.fromInt(1).shiftLeft(48).subtract(1);
        this.addend = Long.fromInt(0xB);
        this.doubleUnit = 1.1102230246251565E-16;
        this.maxInt = Long.fromInt(0x7fffffff);
        this.intMask = Long.fromInt(0x80000000);

        this.setSeed(seed);
    }

    nextBytes(bytes, length) {
        let i = 0;
        while (i < length) {
            let rnd = this.nextInt();
            let n = Math.min(length - i, 32 / 8);

            while (n-- > 0) {
                bytes[i++] = rnd & 0xff;
                rnd >>= 8;
            }
        }
    }

    nextFloat() {
        return this.next(24).toNumber() / (1 << 24);
    }

    nextDouble() {
        return this.next(26).shiftLeft(27).add(this.next(27)).toNumber() * this.doubleUnit;
    }

    nextInt(max = -1) {
        if (max === -1) {
            return this.next(32).toNumber();
        }

        let r = this.next(31);
        let m = max - 1;
        if ((max & m) === 0)  // i.e., bound is a power of 2
            r = Long.fromInt(max).multiply(r).shiftRightUnsigned(31).toNumber();
        else {
            r = r.toNumber();
            for (let u = r;
                 u - (r = u % max) + m < 0;
                 u = this.next(31).toNumber())
                ;
        }
        return r;
    }

    nextLong() {
        return this.next(32).shiftLeft(32).add(this.next(32));
    }

    next(bits) {
        let oldSeed;
        let nextSeed;
        do {
            oldSeed = this.seed;
            nextSeed = oldSeed.multiply(this.multiplier).add(this.addend).and(this.mask);
        } while (!this._compareAndSet(oldSeed, nextSeed));

        let num = nextSeed.shiftRight(48 - bits);
        return num.greaterThan(this.maxInt) ? num.or(this.intMask) : num; // Cast to integer
    }

    _compareAndSet(expect, update) {
        if (!this.seed.equals(expect)) {
            return false;
        }

        this.seed = update;
        return true;
    }

    setSeed(n) {
        let long;

        if (typeof n === "number") {
            long = Long.fromInt(n);
        } else if (n instanceof Long) {
            long = n;
        } else {
            long = Long.fromString(n);
        }

        this.seed = long.xor(this.multiplier).and(this.mask);
    }
}