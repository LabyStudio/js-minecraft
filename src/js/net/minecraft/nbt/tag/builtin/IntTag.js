import Tag from "./Tag.js";

export default class IntTag extends Tag {

    constructor(name, value = 0) {
        super(name);

        this.value = value;
    }

    write(buffer) {
        buffer.writeInt(this.value);
    }

    read(buffer) {
        this.value = buffer.readInt();
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }
}