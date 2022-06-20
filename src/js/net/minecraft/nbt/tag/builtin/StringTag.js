import Tag from "./Tag.js";

export default class StringTag extends Tag {

    constructor(name, value = "") {
        super(name);

        this.value = value;
    }

    write(buffer) {
        let bytes = new TextEncoder().encode(this.value);
        buffer.writeShort(bytes.length);
        buffer.write(bytes, bytes.length);
    }

    read(buffer) {
        let length = buffer.readShort();
        let bytes = new Uint8Array(length);
        buffer.read(bytes, length);
        this.value = new TextDecoder().decode(bytes);
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }
}