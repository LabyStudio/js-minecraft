import Tag from "./Tag.js";

export default class IntArrayTag extends Tag {

    constructor(name, value = []) {
        super(name);

        this.value = value;
    }

    write(buffer) {
        buffer.writeInt(this.value.length);
        for (let i = 0; i < this.value.length; i++) {
            buffer.writeInt(this.value[i]);
        }
    }

    read(buffer) {
        this.value = new Uint8Array(buffer.readInt());
        for (let i = 0; i < this.value.length; i++) {
            this.value[i] = buffer.readInt();
        }
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }
}