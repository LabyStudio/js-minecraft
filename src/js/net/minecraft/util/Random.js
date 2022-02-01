window.Random = class {

    constructor(seed) {
        this.mask = 0xffffffff;
        this.m_w = (123456789 + seed) & this.mask;
        this.m_z = (987654321 - seed) & this.mask;
    }

    nextBoolean() {
        return this.nextFloat() > 0.5;
    }

    nextInt(max) {
        return Math.floor(this.nextFloat() * (max + 1));
    }

    nextFloat() {
        this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >>> 16)) & this.mask;
        this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >>> 16)) & this.mask;

        let result = ((this.m_z << 16) + (this.m_w & 65535)) >>> 0;
        result /= 4294967296;
        return result;
    }
}