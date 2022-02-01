window.Chunk = class {

    constructor(world, x, z) {
        this.world = world;
        this.x = x;
        this.z = z;

        this.group = new THREE.Object3D();
        this.group.matrixAutoUpdate = false;

        this.loaded = false;

        // Initialize sections
        this.sections = [];
        for (let y = 0; y < 16; y++) {
            let section = new ChunkSection(world, this, x, y, z);

            this.sections[y] = section;
            this.group.add(section.group);
        }
    }

    setBlockAt(x, y, z, typeId) {
        this.getSection(y >> 4).setBlockAt(x, y & 15, z, typeId);
    }

    getSection(y) {
        return this.sections[y];
    }

    rebuild(renderer) {
        for (let y = 0; y < this.sections.length; y++) {
            this.sections[y].rebuild(renderer);
        }
    }

    queueForRebuild() {
        for (let y = 0; y < this.sections.length; y++) {
            this.sections[y].queueForRebuild();
        }
    }

    load() {
        this.loaded = true;
    }

    isLoaded() {
        return this.loaded;
    }

}