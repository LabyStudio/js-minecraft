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
    }

    addVertexWithUV(x, y, z, u, v) {
        this.verticies.push(x);
        this.verticies.push(y);
        this.verticies.push(z);

        this.uv.push(u);
        this.uv.push(v);
    }

    draw(group) {
        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.verticies), 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(this.uv), 2));
        geometry.setIndex(new THREE.BufferAttribute(new Uint32Array([0, 2, 1, 0, 3, 2]), 1));

        let mesh = new THREE.Mesh(geometry, this.material);
        group.add(mesh);
    }

}