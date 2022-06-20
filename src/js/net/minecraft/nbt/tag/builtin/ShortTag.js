import Tag from "./Tag.js";

export default class ShortTag extends Tag {

    constructor(name, value = 0) {
        super(name);

        this.value = value;
    }

    write(buffer) {
        buffer.writeShort(this.value);
    }

    read(buffer) {
        this.value = buffer.readShort();
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }
}