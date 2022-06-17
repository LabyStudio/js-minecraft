export default class ByteBuf {

    static SEGMENT_BITS = 0x7F;
    static CONTINUE_BIT = 0x80;

    constructor(array = new Uint8Array(0)) {
        this.array = array;
        this.pos = 0;
    }

    getPosition() {
        return this.pos;
    }

    setPosition(pos) {
        this.pos = pos;
    }

    length() {
        return this.array.length;
    }

    getArray() {
        return this.array;
    }

    readByte() {
        return this.array[this.pos++];
    }

    readShort() {
        return this.array[this.pos++] << 8 | this.array[this.pos++];
    }

    readInt() {
        return this.array[this.pos++] << 24
            | this.array[this.pos++] << 16
            | this.array[this.pos++] << 8
            | this.array[this.pos++];
    }

    readLong() {
        return this.array[this.pos++] << 56
            | this.array[this.pos++] << 48
            | this.array[this.pos++] << 40
            | this.array[this.pos++] << 32
            | this.array[this.pos++] << 24
            | this.array[this.pos++] << 16
            | this.array[this.pos++] << 8
            | this.array[this.pos++];
    }

    readFloat() {
        return this.readInt() / (1 << 24);
    }

    readDouble() {
        return this.readLong() / (1 << 53);
    }

    readString() {
        let len = this.readVarInt();
        let array = new Uint8Array(len);
        this.read(array, len);
        return new TextDecoder().decode(array);
    }

    writeByte(value) {
        this.extendIfNeeded(1);
        this.array[this.pos++] = value;
    }

    writeShort(value) {
        this.extendIfNeeded(2);
        this.array[this.pos++] = value >> 8;
        this.array[this.pos++] = value;
    }

    writeInt(value) {
        this.extendIfNeeded(4);
        this.array[this.pos++] = value >> 24;
        this.array[this.pos++] = value >> 16;
        this.array[this.pos++] = value >> 8;
        this.array[this.pos++] = value;
    }

    writeLong(value) {
        this.extendIfNeeded(8);
        this.array[this.pos++] = value >> 56;
        this.array[this.pos++] = value >> 48;
        this.array[this.pos++] = value >> 40;
        this.array[this.pos++] = value >> 32;
        this.array[this.pos++] = value >> 24;
        this.array[this.pos++] = value >> 16;
        this.array[this.pos++] = value >> 8;
        this.array[this.pos++] = value;
    }

    writeFloat(value) {
        this.writeInt(value * (1 << 24));
    }

    writeDouble(value) {
        this.writeLong(value * (1 << 53));
    }

    writeString(value) {
        let array = new TextEncoder().encode(value);
        this.writeVarInt(array.length);
        this.write(array);
    }

    writeVarInt(value) {
        while (true) {
            if ((value & ~ByteBuf.SEGMENT_BITS) === 0) {
                this.writeByte(value);
                return;
            }

            this.writeByte((value & ByteBuf.SEGMENT_BITS) | ByteBuf.CONTINUE_BIT);

            // Note: >>> means that the sign bit is shifted with the rest of the number rather than being left alone
            value >>>= 7;
        }
    }

    write(array) {
        this.extendIfNeeded(array.length);
        for (let i = 0; i < array.length; i++) {
            this.array[this.pos++] = array[i];
        }
    }

    extendIfNeeded(bytes) {
        if (this.pos + bytes > this.array.length) {
            let newArray = new Uint8Array(this.array.length + bytes);
            newArray.set(this.array);
            this.array = newArray;
        }
    }

    read(array, length) {
        for (let i = 0; i < length; i++) {
            array[i] = this.array[this.pos++];
        }
    }

    readVarInt() {
        let result = 0;
        let shift = 0;
        while (true) {
            let b = this.readByte();
            if ((b & ByteBuf.CONTINUE_BIT) === 0) {
                return result | (b << shift);
            }
            result |= (b & ByteBuf.SEGMENT_BITS) << shift;
            shift += 7;
        }
    }

    readByteArray() {
        let length = this.readVarInt();
        let array = [];
        this.read(array, length);
        return new Int8Array(array);
    }

    writeByteArray(array) {
        this.writeVarInt(array.length);
        this.write(array);
    }
}