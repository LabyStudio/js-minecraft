window.Chunk = class {

    constructor(x, z) {
        this.group = new THREE.Object3D();

        this.x = x;
        this.z = z;

        // Initialize sections
        this.sections = [];
        for (let y = 0; y < 16; y++) {
            let section = new ChunkSection(x, y, z);

            this.sections[y] = section;
            this.group.add(section.group);
        }
    }

    getSection(y) {
        return this.sections[y];
    }

    rebuild() {
        for (let y = 0; y < this.sections.length; y++) {
            this.sections[y].rebuild();
        }
    }

    queueForRebuild() {
        for (let y = 0; y < this.sections.length; y++) {
            this.sections[y].queueForRebuild();
        }
    }

}