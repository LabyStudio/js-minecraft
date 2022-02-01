window.WorldRenderer = class {

    static RENDER_DISTANCE = 4;

    constructor(minecraft) {
        this.minecraft = minecraft;

        this.supportWebGL = !!WebGLRenderingContext
            && (!!document.createElement('canvas').getContext('experimental-webgl')
                || !!document.createElement('canvas').getContext('webgl'));

        // Create cameras
        this.camera = new THREE.PerspectiveCamera(0, 1, 0.001, 1000000);
        this.camera.rotation.order = 'ZYX';
        this.camera.up = new THREE.Vector3(0, 0, 1);

        // Create scene
        this.scene = new THREE.Scene();
        this.scene.matrixAutoUpdate = false;

        // Create web renderer
        this.canvasElement = document.createElement('canvas')
        this.webRenderer = this.supportWebGL ? new THREE.WebGLRenderer({
            canvas: this.canvasElement,
            antialias: false
        }) : new THREE.CanvasRenderer({
            canvas: this.canvasElement,
            antialias: false
        });

        // Settings
        this.webRenderer.shadowMap.enabled = true;
        this.webRenderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        this.webRenderer.autoClear = false;
        this.webRenderer.setClearColor(0x000000, 0);
        this.webRenderer.clear();

        // Load terrain
        this.terrainTexture = new THREE.TextureLoader().load('src/resources/terrain.png');
        this.terrainTexture.magFilter = THREE.NearestFilter;
        this.terrainTexture.minFilter = THREE.NearestFilter;

        // Block Renderer
        this.blockRenderer = new BlockRenderer(this);
    }

    render(partialTicks) {
        // Setup camera
        this.orientCamera(partialTicks);

        // Render chunks
        this.renderChunks(this, partialTicks);

        // Render window
        this.webRenderer.render(this.scene, this.camera);
    }

    orientCamera(partialTicks) {
        let player = this.minecraft.player;

        // Rotation
        this.camera.rotation.y = -player.yaw * (Math.PI / 180) + Math.PI;
        this.camera.rotation.x = -player.pitch * (Math.PI / 180);

        // Position
        let x = player.prevX + (player.x - player.prevX) * partialTicks;
        let y = player.prevY + (player.y - player.prevY) * partialTicks;
        let z = player.prevZ + (player.z - player.prevZ) * partialTicks;
        this.camera.position.set(x, y + player.getEyeHeight(), z);

        // Update FOV
        this.camera.fov = 85 + player.getFOVModifier();
        this.camera.updateProjectionMatrix();

        // Setup fog
        this.setupFog();
    }

    setupFog(inWater) {
        if (inWater) {

        } else {
            let viewDistance = WorldRenderer.RENDER_DISTANCE * ChunkSection.SIZE;

            let color = new THREE.Color(0x9299ff);
            this.scene.background = color;
            this.scene.fog = new THREE.Fog(color, 0.0025, viewDistance);
        }
    }

    renderChunks(renderer, partialTicks) {
        let world = this.minecraft.world;

        for(let i in world.chunks) {
            let chunk = world.chunks[i];

            for (let y = 0; y < chunk.sections.length; y++) {
                let section = chunk.sections[y];

                if (section.dirty) {
                    section.rebuild(renderer);
                }
            }
        }
    }
}