import Tag from "./Tag.js";
import TagRegistry from "../TagRegistry.js";

export default class ListTag extends Tag {

    constructor(name, type, value = []) {
        super(name);

        this.type = type;
        this.value = value;
    }

    write(buffer) {
        if (this.value.length === 0) {
            buffer.writeByte(0);
        } else {
            let id = TagRegistry.getIdFor(this.type);
            if (id === -1) {
                throw new Error("Unknown tag type: " + this.type);
            }
            buffer.writeByte(id);
        }

        buffer.writeInt(this.value.length);
        for (let i = 0; i < this.value.length; i++) {
            this.value[i].write(buffer);
        }
    }

    read(buffer) {
        let id = buffer.readByte();
        this.type = TagRegistry.getClassFor(id);
        this.value = [];

        let length = buffer.readInt();
        for (let i = 0; i < length; i++) {
            let tag = TagRegistry.createInstance(id, "");
            tag.read(buffer);
            this.add(tag);
        }
    }

    add(tag) {
        this.value.push(tag);
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }
}