window.WorldRenderer = class {

    static RENDER_DISTANCE = 4;

    constructor(minecraft, window) {
        this.minecraft = minecraft;
        this.window = window;
        this.chunkSectionUpdateQueue = [];

        // Load terrain texture
        this.textureTerrain = new THREE.TextureLoader().load('src/resources/terrain/terrain.png');
        this.textureTerrain.magFilter = THREE.NearestFilter;
        this.textureTerrain.minFilter = THREE.NearestFilter;

        // Load sun texture
        this.textureSun = new THREE.TextureLoader().load('src/resources/terrain/sun.png');
        this.textureSun.magFilter = THREE.NearestFilter;
        this.textureSun.minFilter = THREE.NearestFilter;

        // Block Renderer
        this.blockRenderer = new BlockRenderer(this);

        this.initialize();
    }

    initialize() {
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
        this.webRenderer = new THREE.WebGLRenderer({
            canvas: this.window.canvas,
            antialias: false,
            alpha: true
        });

        // Settings
        this.webRenderer.setSize(this.window.width, this.window.height);
        this.webRenderer.shadowMap.enabled = true;
        this.webRenderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        this.webRenderer.autoClear = false;
        this.webRenderer.sortObjects = false;
        this.webRenderer.setClearColor(0x000000, 0);
        this.webRenderer.clear();

        this.generateSky();
    }

    render(partialTicks) {
        // Setup camera
        this.orientCamera(partialTicks);

        // Render chunks
        let player = this.minecraft.player;
        let cameraChunkX = Math.floor(player.x >> 4);
        let cameraChunkZ = Math.floor(player.z >> 4);
        this.renderChunks(cameraChunkX, cameraChunkZ);

        // Render sky
        this.renderSky(partialTicks);

        // Render actual scene
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
        this.setupFog(x, z, player.isHeadInWater(), partialTicks);
    }

    setupFog(x, z, inWater, partialTicks) {
        if (inWater) {
            let color = new THREE.Color(0.2, 0.2, 0.4);
            this.scene.background = color;
            this.scene.fog = new THREE.Fog(color, 0.0025, 5);
        } else {
            let viewDistance = WorldRenderer.RENDER_DISTANCE * ChunkSection.SIZE;

            let color = this.minecraft.world.getSkyColor(x, z, partialTicks);
            this.scene.background = new THREE.Color(
                ((color >> 16) & 0xFF) / 255,
                ((color >> 8) & 0xFF) / 255,
                (color & 0xFF) / 255
            );
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

    generateSky() {
        // Create sky group
        this.skyGroup = new THREE.Scene();
        this.scene.add(this.skyGroup);

        // Create sun
        let geometry = new THREE.PlaneGeometry(1, 1);
        let material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            side: THREE.FrontSide,
            map: this.textureSun,
            alphaMap: this.textureSun,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        this.sun = new THREE.Mesh(geometry, material);
        this.sun.translateZ(-2);
        this.sun.renderOrder = 999;
        this.sun.material.depthTest = false;
        this.skyGroup.add(this.sun);
    }

    renderSky(partialTicks) {
        // Center sky
        this.skyGroup.position.copy(this.camera.position);

        // Rotate sky
        let angle = this.minecraft.world.getCelestialAngle(partialTicks);
        this.skyGroup.rotation.set(angle * Math.PI * 2 + Math.PI / 2, 0, 0);
    }
}