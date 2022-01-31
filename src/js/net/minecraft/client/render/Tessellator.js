window.Tessellator = class {

    constructor() {
        this.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.BackSide
        });
    }

    bindTexture(texture) {
        this.material.map = texture;
    }

    startDrawing() {
        this.verticies = [];
        this.uv = [];
        this.index = [];
    }

    addVertexWithUV(x, y, z, u, v) {
        // Add vertex
        this.verticies.push(x);
        this.verticies.push(y);
        this.verticies.push(z);

        // Add UV
        this.uv.push(u);
        this.uv.push(v);

        // Add index
        let index = this.index.length / 6;
        this.index.push(index + 0);
        this.index.push(index + 2);
        this.index.push(index + 1);
        this.index.push(index + 0);
        this.index.push(index + 3);
        this.index.push(index + 2);
    }

    draw(group) {
        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.verticies), 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(this.uv), 2));
        geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(this.index), 1));

        let mesh = new THREE.Mesh(geometry, this.material);
        group.add(mesh);
    }

}