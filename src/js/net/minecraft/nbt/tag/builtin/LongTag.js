import Tag from "./Tag.js";

export default class LongTag extends Tag {

    constructor(name, value = 0) {
        super(name);

        this.value = value;
    }

    write(buffer) {
        buffer.writeLong(this.value);
    }

    read(buffer) {
        this.value = buffer.readLong();
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }
}