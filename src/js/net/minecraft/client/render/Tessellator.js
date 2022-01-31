window.Tessellator = class {

    constructor() {
        this.material = new THREE.MeshBasicMaterial({
            vertexColors: THREE.VertexColors,
            side: THREE.BackSide,
            transparent: true
        });

    }

    bindTexture(texture) {
        this.material.map = texture;
    }

    startDrawing() {
        this.addedVertices = 0;
        this.vertices = [];
        this.uv = [];
        this.colors = [];
    }

    setColor(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    addVertexWithUV(x, y, z, u, v) {
        this.addedVertices++;

        // Add vertex
        this.vertices.push(x);
        this.vertices.push(y);
        this.vertices.push(z);

        // Add UV
        this.uv.push(u);
        this.uv.push(v);

        // Add colors
        this.colors.push(this.red);
        this.colors.push(this.green);
        this.colors.push(this.blue);
    }

    draw(group) {
        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.vertices), 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(this.colors), 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(this.uv), 2));
        geometry.setIndex(new THREE.BufferAttribute(new Uint32Array([0, 2, 1, 0, 3, 2]), 1));

        let mesh = new THREE.Mesh(geometry, this.material);
        group.add(mesh);
    }

}