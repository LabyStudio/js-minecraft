window.WorldRenderer = class {

    static RENDER_DISTANCE = 4;

    constructor(minecraft, window) {
        this.minecraft = minecraft;
        this.window = window;
        this.chunkSectionUpdateQueue = [];

        this.supportWebGL = !!WebGLRenderingContext
            && (!!document.createElement('canvas').getContext('experimental-webgl')
                || !!document.createElement('canvas').getContext('webgl'));

        // Load terrain
        this.terrainTexture = new THREE.TextureLoader().load('src/resources/terrain.png');
        this.terrainTexture.magFilter = THREE.NearestFilter;
        this.terrainTexture.minFilter = THREE.NearestFilter;

        // Block Renderer
        this.blockRenderer = new BlockRenderer(this);

        // Initialize renderers
        this.initializeRenderer();
        this.initializeGui();

        // Load renderer into window
        this.window.loadRenderer(this);
    }

    initializeRenderer() {
        // Create world camera
        this.camera = new THREE.PerspectiveCamera(0, 1, 0.001, 1000);
        this.camera.rotation.order = 'ZYX';
        this.camera.up = new THREE.Vector3(0, 0, 1);

        // Frustum
        this.frustum = new THREE.Frustum();

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
        this.webRenderer.setSize(this.window.width, this.window.height);
        this.webRenderer.shadowMap.enabled = true;
        this.webRenderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        this.webRenderer.autoClear = false;
        this.webRenderer.sortObjects = false;
        this.webRenderer.setClearColor(0x000000, 0);
        this.webRenderer.clear();
    }

    initializeGui() {
        // We will use 2D canvas element to render our HUD.
        this.canvas2d = document.createElement('canvas')

        // Update camera size
        this.canvas2d.width = this.window.width;
        this.canvas2d.height = this.window.height;

        // Get context stack of 2d canvas
        this.stack2d = this.canvas2d.getContext('2d');

        // Create texture from rendered graphics.
        this.frameBuffer = new THREE.Texture(this.canvas2d)
        this.frameBuffer.needsUpdate = true;
        this.frameBuffer.minFilter = THREE.LinearFilter;

        // Create HUD material.
        let material = new THREE.MeshBasicMaterial({
            map: this.frameBuffer,
            transparent: true
        });

        // Create plane to render the HUD. This plane fill the whole screen.
        let geometry = new THREE.PlaneGeometry(this.canvas2d.width, this.canvas2d.height);
        let plane = new THREE.Mesh(geometry, material);

        // Create also a custom scene for HUD.
        this.scene2d = new THREE.Scene();
        this.scene2d.add(plane);

        // Create 2D camera
        this.camera2d = new THREE.OrthographicCamera(0, 0, 0, 0, 0, 30);
        this.camera2d.aspect = this.window.width / this.window.height;
        this.camera2d.left = -this.window.width / 2;
        this.camera2d.right = this.window.width / 2;
        this.camera2d.top = this.window.height / 2;
        this.camera2d.bottom = -this.window.height / 2;
        this.camera2d.updateProjectionMatrix();
    }

    render(partialTicks) {
        // Setup camera
        this.orientCamera(partialTicks);

        // Render chunks
        let player = this.minecraft.player;
        let cameraChunkX = Math.floor(player.x >> 4);
        let cameraChunkZ = Math.floor(player.z >> 4);
        this.renderChunks(cameraChunkX, cameraChunkZ);

        // Render in-game overlay
        let mouseX = this.minecraft.window.mouseX;
        let mouseY = this.minecraft.window.mouseY;
        this.minecraft.ingameOverlay.render(this.stack2d, mouseX, mouseY, partialTicks);

        // Render actual scene and hud
        this.webRenderer.render(this.scene, this.camera);
        this.webRenderer.render(this.scene2d, this.camera2d);
    }

    orientCamera(partialTicks) {
        let player = this.minecraft.player;

        // Rotation
        this.camera.rotation.y = -MathHelper.toRadians(player.yaw + 180);
        this.camera.rotation.x = -MathHelper.toRadians(player.pitch);

        // Position
        let x = player.prevX + (player.x - player.prevX) * partialTicks;
        let y = player.prevY + (player.y - player.prevY) * partialTicks;
        let z = player.prevZ + (player.z - player.prevZ) * partialTicks;
        this.camera.position.set(x, y + player.getEyeHeight(), z);

        // Update frustum
        this.frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse));

        // Update FOV
        this.camera.fov = 85 + player.getFOVModifier();
        this.camera.updateProjectionMatrix();

        // Setup fog
        this.setupFog(player.isHeadInWater());
    }

    setupFog(inWater) {
        if (inWater) {
            let color = new THREE.Color(0.2, 0.2, 0.4);
            this.scene.background = color;
            this.scene.fog = new THREE.Fog(color, 0.0025, 5);
        } else {
            let viewDistance = WorldRenderer.RENDER_DISTANCE * ChunkSection.SIZE;

            let color = new THREE.Color(0x9299ff);
            this.scene.background = color;
            this.scene.fog = new THREE.Fog(color, 0.0025, viewDistance);
        }
    }

    renderChunks(cameraChunkX, cameraChunkZ) {
        let world = this.minecraft.world;
        let renderDistance = WorldRenderer.RENDER_DISTANCE;

        // Load chunks
        for (let x = -renderDistance; x <= renderDistance; x++) {
            for (let z = -renderDistance; z <= renderDistance; z++) {
                world.getChunkAt(cameraChunkX + x, cameraChunkZ + z);
            }
        }

        // Update chunks
        for (let [index, chunk] of world.chunks) {
            let distanceX = Math.abs(cameraChunkX - chunk.x);
            let distanceZ = Math.abs(cameraChunkZ - chunk.z);

            // Is in render distance check
            if (distanceX < renderDistance && distanceZ < renderDistance) {
                // Make chunk visible
                chunk.group.visible = true;

                // For all chunk sections
                for (let y in chunk.sections) {
                    let chunkSection = chunk.sections[y];

                    // Is in camera view check
                    if (this.frustum.intersectsBox(chunkSection.boundingBox)) {
                        // Make section visible
                        chunkSection.group.visible = true;

                        // Render chunk section
                        chunkSection.render();

                        // Queue for rebuild
                        if (chunkSection.isModified && !this.chunkSectionUpdateQueue.includes(chunkSection)) {
                            this.chunkSectionUpdateQueue.push(chunkSection);
                        }
                    } else {
                        // Hide section
                        chunkSection.group.visible = false;
                    }
                }
            } else {
                // Hide chunk
                chunk.group.visible = false;
            }
        }

        // Sort update queue, chunk sections that are closer to the camera get a higher priority
        this.chunkSectionUpdateQueue.sort((section1, section2) => {
            let distance1 = Math.floor(Math.pow(section1.x - cameraChunkX, 2) + Math.pow(section1.z - cameraChunkZ, 2));
            let distance2 = Math.floor(Math.pow(section2.x - cameraChunkX, 2) + Math.pow(section2.z - cameraChunkZ, 2));
            return distance1 - distance2;
        });

        // Rebuild 16 chunk sections per frame (An entire chunk)
        for (let i = 0; i < 16; i++) {
            if (this.chunkSectionUpdateQueue.length !== 0) {
                let chunkSection = this.chunkSectionUpdateQueue.shift();
                if (chunkSection != null) {
                    // Rebuild chunk
                    chunkSection.rebuild(this);
                }
            }
        }
    }
}