import BlockRenderer from "./BlockRenderer.js";
import EntityRenderManager from "./entity/EntityRenderManager.js";
import MathHelper from "../../util/MathHelper.js";
import ChunkSection from "../world/ChunkSection.js";
import Block from "../world/block/Block.js";

export default class WorldRenderer {

    static RENDER_DISTANCE = 4;
    static THIRD_PERSON_DISTANCE = 4;

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

        // Load moon texture
        this.textureMoon = new THREE.TextureLoader().load('src/resources/terrain/moon.png');
        this.textureMoon.magFilter = THREE.NearestFilter;
        this.textureMoon.minFilter = THREE.NearestFilter;

        // Block Renderer
        this.blockRenderer = new BlockRenderer(this);

        // Entity render manager
        this.entityRenderManager = new EntityRenderManager(this);

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

        // Create sky
        this.generateSky();

        // Create block hit box
        let geometry = new THREE.BoxGeometry(1, 1, 1);
        let edges = new THREE.EdgesGeometry(geometry);
        this.blockHitBox = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
            color: 0x000000,
        }));
        this.scene.add(this.blockHitBox);
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

        // Render target block
        this.renderBlockHitBox(player, partialTicks);

        // Render entities
        for (let entity of this.minecraft.world.entities) {
            if (entity === player && this.minecraft.settings.thirdPersonView === 0) {
                entity.group.clear(); // Remove entity from scene
                delete entity.group.buildMeta; // To trigger a rebuild on the next render
                continue;
            }
            this.renderEntity(entity, partialTicks);
        }

        // Render actual scene
        this.webRenderer.render(this.scene, this.camera);
    }

    orientCamera(partialTicks) {
        let player = this.minecraft.player;

        let rotationY = -MathHelper.toRadians(player.rotationYaw + 180);
        let rotationX = -MathHelper.toRadians(player.rotationPitch);

        // Position
        let x = player.prevX + (player.x - player.prevX) * partialTicks;
        let y = player.prevY + (player.y - player.prevY) * partialTicks;
        let z = player.prevZ + (player.z - player.prevZ) * partialTicks;

        // Add camera offset
        let mode = this.minecraft.settings.thirdPersonView;
        if (mode !== 0) {
            // Flip for front view
            let frontView = mode === 2;
            if (frontView) {
                rotationY += Math.PI;
                rotationX *= -1;
            }

            // Shift camera
            let cameraOffsetX = Math.sin(rotationY) * Math.cos(rotationX);
            let cameraOffsetY = Math.sin(-rotationX);
            let cameraOffsetZ = Math.cos(rotationY) * Math.cos(rotationX);

            x += cameraOffsetX * WorldRenderer.THIRD_PERSON_DISTANCE;
            y += cameraOffsetY * WorldRenderer.THIRD_PERSON_DISTANCE;
            z += cameraOffsetZ * WorldRenderer.THIRD_PERSON_DISTANCE;
        }

        // Update rotation
        this.camera.rotation.y = rotationY;
        this.camera.rotation.x = rotationX;

        // Update camera positionWC
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

    rebuildAll() {
        let world = this.minecraft.world;
        for (let [index, chunk] of world.chunks) {
            chunk.setModifiedAllSections();
        }
    }

    generateSky() {
        // Create sky group
        this.skyGroup = new THREE.Scene();
        this.scene.add(this.skyGroup);

        // Create sun
        let geometry = new THREE.PlaneGeometry(1, 1);
        let materialSun = new THREE.MeshBasicMaterial({
            side: THREE.FrontSide,
            map: this.textureSun,
            alphaMap: this.textureSun,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        this.sun = new THREE.Mesh(geometry, materialSun);
        this.sun.translateZ(-2);
        this.sun.renderOrder = 999;
        this.sun.material.depthTest = false;
        this.skyGroup.add(this.sun);

        // Create moon
        let materialMoon = new THREE.MeshBasicMaterial({
            side: THREE.BackSide,
            map: this.textureMoon,
            alphaMap: this.textureMoon,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        this.moon = new THREE.Mesh(geometry, materialMoon);
        this.moon.translateZ(2);
        this.moon.renderOrder = 999;
        this.moon.material.depthTest = false;
        this.skyGroup.add(this.moon);
    }

    renderSky(partialTicks) {
        // Center sky
        this.skyGroup.position.copy(this.camera.position);

        // Rotate sky
        let angle = this.minecraft.world.getCelestialAngle(partialTicks);
        this.skyGroup.rotation.set(angle * Math.PI * 2 + Math.PI / 2, 0, 0);
    }

    renderBlockHitBox(player, partialTicks) {
        let hitResult = player.rayTrace(5, partialTicks);
        let hitBoxVisible = !(hitResult === null);
        if ((this.blockHitBox.visible = hitBoxVisible)) {
            let x = hitResult.x;
            let y = hitResult.y;
            let z = hitResult.z;

            // Get block type
            let world = this.minecraft.world;
            let typeId = world.getBlockAt(x, y, z);
            let block = Block.getById(typeId);

            if (typeId !== 0) {
                let boundingBox = block.getBoundingBox(world, x, y, z);

                let offset = 0.01;

                let width = boundingBox.width() + offset;
                let height = boundingBox.height() + offset;
                let depth = boundingBox.depth() + offset;

                // Update size of hit box
                this.blockHitBox.scale.set(
                    width,
                    height,
                    depth
                );

                // Update position of hit box
                this.blockHitBox.position.set(
                    x + width / 2 / width - 0.5 + boundingBox.maxX - width / 2 + offset / 2,
                    y + height / 2 / height - 0.5 + boundingBox.maxY - height / 2 + offset / 2,
                    z + depth / 2 / depth - 0.5 + boundingBox.maxZ - depth / 2 + offset / 2,
                );
            }
        }
    }

    renderEntity(entity, partialTicks) {
        let entityRenderer = this.entityRenderManager.getEntityRendererByEntity(entity);
        entityRenderer.render(entity, partialTicks);
    }
}