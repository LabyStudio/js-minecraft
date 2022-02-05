window.ItemRenderer = class {

    constructor(minecraft, window) {
        this.minecraft = minecraft;
        this.window = window;

        this.items = [];
    }

    initialize() {
        // Create item camera
        this.camera = new THREE.OrthographicCamera(0, 0, 0, 0, 0, 300);
        this.camera.near = 0;
        this.camera.far = 15;
        this.camera.rotation.order = 'ZYX';
        this.camera.up = new THREE.Vector3(0, 1, 0);

        // Create scene
        this.scene = new THREE.Scene();
        this.scene.matrixAutoUpdate = false;

        // Create web renderer
        this.webRenderer = new THREE.WebGLRenderer({
            canvas: this.window.canvasItems,
            antialias: true
        });

        // Settings
        this.webRenderer.setSize(this.window.width, this.window.height);
        this.webRenderer.shadowMap.enabled = true;
        this.webRenderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        this.webRenderer.autoClear = false;
        this.webRenderer.sortObjects = false;
        this.webRenderer.setClearColor(0x000000, 0);
        this.webRenderer.clear();
    }

    render(partialTicks) {
        // Update camera
        this.camera.left = -this.window.width / 2;
        this.camera.right = this.window.width / 2;
        this.camera.top = this.window.height / 2;
        this.camera.bottom = -this.window.height / 2;
        this.camera.setViewOffset(this.window.width, this.window.height, this.window.width / 2, this.window.height / 2, this.window.width, this.window.height);
        this.camera.updateProjectionMatrix();

        // Render scene
        this.webRenderer.render(this.scene, this.camera);
    }

    renderItemInGui(renderId, block, x, y) {
        let meta = this.items[renderId];
        if (typeof meta === "undefined") {
            let meta = {};

            let group = new THREE.Group();
            this.minecraft.worldRenderer.blockRenderer.renderGuiBlock(group, block, x, y, 10);
            this.scene.add(group);

            meta.group = group;
            meta.typeId = block.getId();
            meta.x = x;
            meta.y = y;
            this.items[renderId] = meta;
        } else {
            if (meta.typeId !== block.getId() || meta.x !== x || meta.y !== y) {
                this.scene.remove(meta.group);
                delete this.items[renderId];
                this.renderItemInGui(renderId, block, x, y);
            }
        }
    }
}