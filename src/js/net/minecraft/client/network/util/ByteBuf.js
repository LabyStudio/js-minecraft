import Long from "../../../../../../../libraries/long.js";
import BlockPosition from "../../../util/BlockPosition.js";
import UUID from "../../../util/UUID.js";
import {format} from "../../../../../../../libraries/chat.js";
import Vector3 from "../../../util/Vector3.js";
import NBTIO from "../../../nbt/NBTIO.js";

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

    getSlicedArray(length = this.array.length - this.pos) {
        return this.array.slice(this.pos, this.pos + length);
    }

    readByte(pos = this.pos) {
        this.pos = pos;
        return this.array[this.pos++];
    }

    readUnsignedByte(pos = this.pos) {
        return this.readByte(pos) & 0xFF;
    }

    readShort() {
        return this.array[this.pos++] << 8 | this.array[this.pos++];
    }

    readInt() {
        return this.readUnsignedByte() << 24
            | this.readUnsignedByte() << 16
            | this.readUnsignedByte() << 8
            | this.readUnsignedByte();
    }

    readLong() {
        return Long.fromNumber(this.readUnsignedByte()).shiftLeft(56)
            .or(Long.fromNumber(this.readUnsignedByte()).shiftLeft(48))
            .or(Long.fromNumber(this.readUnsignedByte()).shiftLeft(40))
            .or(Long.fromNumber(this.readUnsignedByte()).shiftLeft(32))
            .or(Long.fromNumber(this.readUnsignedByte()).shiftLeft(24))
            .or(Long.fromNumber(this.readUnsignedByte()).shiftLeft(16))
            .or(Long.fromNumber(this.readUnsignedByte()).shiftLeft(8))
            .or(Long.fromNumber(this.readUnsignedByte()).shiftLeft(0));
    }

    readFloat() {
        let num = this.readInt();
        return new Float32Array(new Uint32Array([num, 0, 0, 0, 0, 0, 0, 0]).buffer)[0];
    }

    readDouble() {
        let lng = this.readLong();
        return new Float64Array(new Uint32Array([lng.low >>> 0, lng.high >>> 0, 0, 0, 0, 0, 0, 0]).buffer)[0];
    }

    readBoolean() {
        return this.readByte() !== 0;
    }

    readString(maxLength) {
        let len = this.readVarInt();
        if (len > maxLength * 4) {
            throw new Error("Trying to read string longer than max length  (" + len + " > " + (maxLength * 4) + ")");
        }

        let array = new Uint8Array(len);
        this.read(array, len);
        return new TextDecoder().decode(array);
    }

    writeByte(value, pos = this.pos) {
        this.pos = pos;
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
        this.array[this.pos++] = value.shiftRightUnsigned(56).toInt() & 0xFF;
        this.array[this.pos++] = value.shiftRightUnsigned(48).toInt() & 0xFF;
        this.array[this.pos++] = value.shiftRightUnsigned(40).toInt() & 0xFF;
        this.array[this.pos++] = value.shiftRightUnsigned(32).toInt() & 0xFF;
        this.array[this.pos++] = value.shiftRightUnsigned(24).toInt() & 0xFF;
        this.array[this.pos++] = value.shiftRightUnsigned(16).toInt() & 0xFF;
        this.array[this.pos++] = value.shiftRightUnsigned(8).toInt() & 0xFF;
        this.array[this.pos++] = value.toInt() & 0xFF;
    }

    writeFloat(value) {
        let buffer = new Uint32Array(new Float32Array([value, 0, 0, 0, 0, 0, 0, 0]).buffer);
        this.writeInt(buffer[0]);
    }

    writeDouble(value) {
        let buffer = new Uint32Array(new Float64Array([value, 0, 0, 0, 0, 0, 0, 0]).buffer);
        this.writeLong(Long.fromBits(buffer[0], buffer[1]));
    }

    writeString(value) {
        let array = new TextEncoder().encode(value);
        this.writeVarInt(array.length);
        this.write(array);
    }

    writeBoolean(value) {
        this.writeByte(value ? 1 : 0);
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

    skipBytes(length) {
        this.pos += length;
    }

    extendIfNeeded(bytes) {
        if (this.pos + bytes > this.array.length) {
            let length = this.array.length + bytes;

            let newArray = this.array instanceof Uint8Array ? new Uint8Array(length) : new Int8Array(length);
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

    writeBlockPosition(blockPosition) {
        this.writeLong(blockPosition.toLong());
    }

    readBlockPosition() {
        return BlockPosition.fromLong(this.readLong());
    }

    readUUID() {
        return new UUID(this.readLong(), this.readLong());
    }

    writeUUID(uuid) {
        this.writeLong(uuid.getMostSignificantBits());
        this.writeLong(uuid.getLeastSignificantBits());
    }

    readTextComponent() {
        return format(JSON.parse(this.readString(32767)));
    }

    readMetaData() {
        let metaData = {};

        let data = 0;
        while ((data = this.readByte()) !== 0x7f) {
            let typeId = (data & 0xE0) >> 5;
            let id = data & 0x1F;

            let value = null;
            switch (typeId) {
                case 0:
                    value = this.readByte();
                    break;
                case 1:
                    value = this.readShort();
                    break;
                case 2:
                    value = this.readInt();
                    break;
                case 3:
                    value = this.readFloat();
                    break;
                case 4:
                    value = this.readString();
                    break;
                case 5:
                    value = this.readItem();
                    break;
                case 6:
                    value = new BlockPosition(this.readInt(), this.readInt(), this.readInt());
                    break;
                case 7:
                    value = new Vector3(this.readFloat(), this.readFloat(), this.readFloat());
                    break;
                default:
                    throw new Error("Unknown meta data type: " + typeId);
            }
            metaData[id] = {
                id: id,
                type: typeId,
                value: value
            };
        }

        return metaData;
    }

    readItem() {
        let item = this.readShort();
        if (item < 0) {
            return null;
        } else {
            let a = this.readByte();
            let b = this.readShort();
            let c = this.readNBT();

            // TODO create item
            return item;
        }
    }

    readNBT() {
        let position = this.getPosition();

        let tagId = this.readByte();
        if (tagId === 0) {
            return null;
        } else {
            this.setPosition(position);
            return NBTIO.readTag(this); // TODO
        }
    }

    readableBytes() {
        return this.array.length - this.pos;
    }

    toString() {
        return Array.from(this.array, byte => {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
    }
}