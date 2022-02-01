window.WorldRenderer = class {

    static RENDER_DISTANCE = 4;

    constructor(minecraft) {
        this.minecraft = minecraft;

        this.supportWebGL = !!WebGLRenderingContext
            && (!!document.createElement('canvas').getContext('experimental-webgl')
                || !!document.createElement('canvas').getContext('webgl'));

        // Create cameras
        this.camera = new THREE.PerspectiveCamera(0, 1, 0.001, 1000);
        this.camera.rotation.order = 'ZYX';
        this.camera.up = new THREE.Vector3(0, 0, 1);

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

        this.chunkSectionUpdateQueue = [];
    }

    render(partialTicks) {
        // Setup camera
        this.orientCamera(partialTicks);

        // Render chunks
        let player = this.minecraft.player;
        let cameraChunkX = Math.floor(player.x >> 4);
        let cameraChunkZ = Math.floor(player.z >> 4);
        this.renderChunks(cameraChunkX, cameraChunkZ);

        // Render window
        this.webRenderer.render(this.scene, this.camera);
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

        for (let i in world.chunks) {
            let chunk = world.chunks[i];

            let distanceX = Math.abs(cameraChunkX - chunk.x);
            let distanceZ = Math.abs(cameraChunkZ - chunk.z);

            // Is in render distance check
            if (distanceX < WorldRenderer.RENDER_DISTANCE && distanceZ < WorldRenderer.RENDER_DISTANCE) {
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
                        if (chunkSection.isQueuedForRebuild() && !this.chunkSectionUpdateQueue.includes(chunkSection)) {
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
                    // Load chunk
                    let chunk = chunkSection.chunk;
                    if (!chunk.isLoaded()) {
                        world.loadChunk(chunk);

                        // Rebuild neighbor chunks to update transparent blocks
                        for (let relX = -1; relX <= 1; relX++) {
                            for (let relZ = -1; relZ <= 1; relZ++) {
                                let neighborChunk = world.getChunkAt(chunk.x + relX, chunk.z + relZ);
                                neighborChunk.queueForRebuild();
                            }
                        }
                    }

                    // Rebuild chunk
                    chunkSection.rebuild(this);
                }
            }
        }
    }
}