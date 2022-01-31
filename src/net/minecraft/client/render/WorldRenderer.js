window.WorldRenderer = class {

    constructor(minecraft) {
        this.minecraft = minecraft;

        this.supportWebGL = !!WebGLRenderingContext
            && (!!document.createElement('canvas').getContext('experimental-webgl')
                || !!document.createElement('canvas').getContext('webgl'));

        // Create cameras
        this.camera = new THREE.PerspectiveCamera(0, 1, 0.001, 10000);
        this.camera.rotation.order = 'ZYX';
        this.camera.up = new THREE.Vector3(0, 0, 1);

        // Create scene
        this.scene = new THREE.Scene();

        // Create web renderer
        this.canvasElement = document.createElement('canvas')
        this.webRenderer = this.supportWebGL ? new THREE.WebGLRenderer({
            canvas: this.canvasElement,
            antialias: true
        }) : new THREE.CanvasRenderer({
            canvas: this.canvasElement,
            antialias: true
        });

        this.webRenderer.shadowMap.enabled = true;
        this.webRenderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        this.webRenderer.autoClear = false;
        this.webRenderer.setClearColor(0x000000, 0);
        this.webRenderer.clear();

        const nightLight = new THREE.AmbientLight(0x888888, 1.0);
        this.scene.add(nightLight);
    }

    render(partialTicks) {
        // Setup camera
        this.orientCamera(partialTicks);

        // Render chunks
        this.renderChunks(partialTicks);

        // Render window
        this.webRenderer.render(this.scene, this.camera);
    }

    orientCamera(partialTicks) {
        let player = this.minecraft.player;

        // Rotation
        this.camera.rotation.y = player.yaw * (Math.PI / 180);
        this.camera.rotation.x = player.pitch * (Math.PI / 180);

        // Position
        let x = player.prevX + (player.x - player.prevX) * partialTicks;
        let y = player.prevY + (player.y - player.prevY) * partialTicks;
        let z = player.prevZ + (player.z - player.prevZ) * partialTicks;
        this.camera.position.set(x, y + player.getEyeHeight(), z);

        // Update FOV
        this.camera.fov = 85 + player.getFOVModifier();
        this.camera.updateProjectionMatrix();
    }

    renderChunks(partialTicks) {
        let world = this.minecraft.world;

        const xKeys = Object.keys(world.chunks)
        for (let x = 0; x < xKeys.length; x++) {

            let zArray = world.chunks[xKeys[x]];
            const zKeys = Object.keys(zArray)

            for (let z = 0; z < zKeys.length; z++) {
                let chunk = zArray[zKeys[z]];

                for (let y = 0; y < chunk.sections.length; y++) {
                    let section = chunk.sections[y];

                    if (section.dirty) {
                        section.rebuild();
                    }
                }
            }
        }
    }
}