import Tag from "./Tag.js";

export default class FloatTag extends Tag {

    constructor(name, value = 0) {
        super(name);

        this.value = value;
    }

    write(buffer) {
        buffer.writeFloat(this.value);
    }

    read(buffer) {
        this.value = buffer.readFloat();
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }
}