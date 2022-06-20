import Tag from "./Tag.js";

export default class ByteArrayTag extends Tag {

    constructor(name, value = new Uint8Array(0)) {
        super(name);

        this.value = value;
    }

    write(buffer) {
        buffer.writeInt(this.value.length);
        buffer.write(this.value, this.value.length);
    }

    read(buffer) {
        this.value = new Uint8Array(buffer.readInt());
        buffer.read(this.value, this.value.length);
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }
}