import * as THREE from "../../../../../../libraries/three.module.js";

export default class Tessellator {

    constructor() {
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.FrontSide,
            transparent: true,
            depthTest: true,
            vertexColors: true
        });

        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.alpha = 0;
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

    setColorRGB(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    setColor(red, green, blue, alpha = 1) {
        this.setColorRGB(red, green, blue);
        this.setAlpha(alpha);
    }

    multiplyColor(red, green, blue, alpha = 1) {
        this.red *= red;
        this.green *= green;
        this.blue *= blue;
        this.alpha *= alpha;
    }

    setAlpha(alpha) {
        this.alpha = alpha;
    }

    addVertex(x, y, z) {
        this.addedVertices++;

        // Add vertex
        this.vertices.push(x);
        this.vertices.push(y);
        this.vertices.push(z);

        // Add colors
        this.colors.push(this.red);
        this.colors.push(this.green);
        this.colors.push(this.blue);
        this.colors.push(this.alpha);
    }

    addVertexWithUV(x, y, z, u, v) {
        this.addVertex(x, y, z);

        // Add UV
        this.uv.push(u);
        this.uv.push(v);
    }

    transformBrightness(brightness) {
        for (let i = 0; i < this.colors.length / 4; i++) {
            this.colors[i * 4 + 0] *= brightness;
            this.colors[i * 4 + 1] *= brightness;
            this.colors[i * 4 + 2] *= brightness;
        }
    }

    draw(group) {
        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.vertices), 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(this.colors), 4));
        if (this.uv.length > 0) {
            geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(this.uv), 2));
        }

        // Create index array
        let index = [];
        let verticesPerFace = 4;
        for (let i = 0; i < this.addedVertices / verticesPerFace; i++) {
            index.push(i * verticesPerFace + 0);
            index.push(i * verticesPerFace + 2);
            index.push(i * verticesPerFace + 1);
            index.push(i * verticesPerFace + 0);
            index.push(i * verticesPerFace + 3);
            index.push(i * verticesPerFace + 2);
        }
        geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(index), 1));

        let mesh = new THREE.Mesh(geometry, this.material);
        group.matrixAutoUpdate = false;
        group.add(mesh);
        return mesh;
    }

}