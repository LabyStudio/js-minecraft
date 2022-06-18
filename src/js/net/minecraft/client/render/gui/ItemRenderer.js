import * as THREE from "../../../../../../../libraries/three.module.js";

export default class ItemRenderer {

    constructor(minecraft, window) {
        this.minecraft = minecraft;
        this.window = window;

        this.items = [];
        this.zIndex = 0;

        this.scheduledDirty = [];
    }

    initialize() {
        // Create item camera
        this.camera = new THREE.OrthographicCamera(0, 0, 0, 0, -15, 15);
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
        this.webRenderer.clear();
        this.webRenderer.render(this.scene, this.camera);
    }

    prepareRender(groupId) {
        if (this.scheduledDirty.includes(groupId)) {
            this.scheduledDirty.splice(this.scheduledDirty.indexOf(groupId), 1);
            this.destroy(groupId);
        }
    }

    renderItemInGui(groupId, renderId, block, x, y, brightness = 1) {
        let pairId = groupId + ':' + renderId;
        let meta = this.items[pairId];
        if (typeof meta === "undefined") {
            let meta = {};

            // Render item
            let group = new THREE.Group();
            this.minecraft.worldRenderer.blockRenderer.renderGuiBlock(group, block, x, y, 10, brightness);
            group.position.z = this.zIndex;
            group.updateMatrix();
            this.scene.add(group);

            // Create meta
            meta.renderId = renderId;
            meta.groupId = groupId;
            meta.group = group;
            meta.brightness = brightness;
            meta.typeId = block.getId();
            meta.x = x;
            meta.y = y;
            meta.dirty = false;
            this.items[pairId] = meta;
        } else {
            // Check if rendered item has changed
            if (meta.dirty || meta.typeId !== block.getId() || meta.x !== x || meta.y !== y || meta.brightness !== brightness) {
                // Rebuild item
                this.scene.remove(meta.group);
                delete this.items[pairId];
                this.renderItemInGui(groupId, renderId, block, x, y, brightness);
            }
        }
    }

    rebuildAllItems() {
        for (let i in this.items) {
            this.items[i].dirty = true;
        }
        this.itemInHand = null;
    }

    reset() {
        for (let i in this.items) {
            this.scene.remove(this.items[i].group);
        }
        this.items = [];
        this.webRenderer.clear();
    }

    scheduleDirty(groupId) {
        if (this.scheduledDirty.includes(groupId)) {
            return;
        }
        this.scheduledDirty.push(groupId);
    }

    destroy(groupId, renderId = null) {
        for (let i in this.items) {
            if (this.items[i].groupId === groupId && (renderId === null || this.items[i].renderId === renderId)) {
                this.scene.remove(this.items[i].group);
                delete this.items[i];
            }
        }
    }
}