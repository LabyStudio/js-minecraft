import TagRegistry from "./tag/TagRegistry.js";

export default class {

    static readTag(buffer) {
        let id = buffer.readUnsignedByte();
        if (id === 0) {
            return null;
        }

        let nameLength = buffer.readShort();
        let nameBytes = new Uint8Array(nameLength);
        buffer.read(nameBytes, nameLength);
        let name = new TextDecoder().decode(nameBytes);

        let tag = TagRegistry.createInstance(id, name);
        tag.read(buffer);
        return tag;
    }

    static writeTag(buffer, tag) {
        let nameBytes = new TextEncoder().encode(tag.getName());
        buffer.writeByte(TagRegistry.getIdFor(tag));
        buffer.writeShort(nameBytes.length);
        buffer.write(nameBytes);
        tag.write(buffer);
    }

}