import Tag from "./Tag.js";

export default class DoubleTag extends Tag {

    constructor(name, value = 0) {
        super(name);

        this.value = value;
    }

    write(buffer) {
        buffer.writeDouble(this.value);
    }

    read(buffer) {
        this.value = buffer.readDouble();
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }
}