import Tag from "./Tag.js";

export default class ByteTag extends Tag {

    constructor(name, value = 0) {
        super(name);

        this.value = value;
    }

    write(buffer) {
        buffer.writeByte(this.value);
    }

    read(buffer) {
        this.value = buffer.readByte();
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }
}