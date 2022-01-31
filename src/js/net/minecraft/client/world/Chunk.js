window.Chunk = class {

    constructor(world, x, z) {
        this.world = world;
        this.x = x;
        this.z = z;

        this.group = new THREE.Object3D();

        // Initialize sections
        this.sections = [];
        for (let y = 0; y < 16; y++) {
            let section = new ChunkSection(world, x, y, z);

            this.sections[y] = section;
            this.group.add(section.group);
        }
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

}