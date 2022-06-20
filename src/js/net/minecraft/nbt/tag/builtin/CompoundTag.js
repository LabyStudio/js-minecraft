import Tag from "./Tag.js";
import NBTIO from "../../NBTIO.js";

export default class CompoundTag extends Tag {

    constructor(name, value = new Map()) {
        super(name);

        this.value = value;
    }

    write(buffer) {
        for (let [key, tag] of this.value) {
            NBTIO.writeTag(buffer, tag);
        }
        buffer.writeByte(0);
    }

    read(buffer) {
        let tags = [];
        let tag = null;
        while ((tag = NBTIO.readTag(buffer)) !== null) {
            tags.push(tag);
        }
        for (let tag of tags) {
            this.put(tag);
        }
    }

    put(tag) {
        this.value.set(tag.getName(), tag);
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }
}