import Timer from "../util/Timer.js";
import GameSettings from "./GameSettings.js";
import GameWindow from "./GameWindow.js";
import WorldRenderer from "./render/WorldRenderer.js";
import ScreenRenderer from "./render/gui/ScreenRenderer.js";
import ItemRenderer from "./render/gui/ItemRenderer.js";
import IngameOverlay from "./gui/IngameOverlay.js";
import PlayerEntity from "./entity/PlayerEntity.js";
import SoundManager from "./sound/SoundManager.js";
import Block from "./world/block/Block.js";
import BoundingBox from "../util/BoundingBox.js";
import {BlockRegistry} from "./world/block/BlockRegistry.js";
import FontRenderer from "./render/gui/FontRenderer.js";
import GrassColorizer from "./render/GrassColorizer.js";
import GuiMainMenu from "./gui/screens/GuiMainMenu.js";
import GuiLoadingScreen from "./gui/screens/GuiLoadingScreen.js";
import * as THREE from "../../../../../libraries/three.module.js";

export default class Minecraft {

    static VERSION = "1.0.0"
    static URL_GITHUB = "https://github.com/labystudio/js-minecraft";

    /**
     * Create Minecraft instance and render it on a canvas
     */
    constructor(canvasWrapperId, resources) {
        this.resources = resources;

        this.currentScreen = null;
        this.loadingScreen = null;
        this.world = null;
        this.player = null;

        this.fps = 0;

        // Tick timer
        this.timer = new Timer(20);

        this.settings = new GameSettings();
        this.settings.load();

        // Create window and world renderer
        this.window = new GameWindow(this, canvasWrapperId);

        // Create renderers
        this.worldRenderer = new WorldRenderer(this, this.window);
        this.screenRenderer = new ScreenRenderer(this, this.window);
        this.itemRenderer = new ItemRenderer(this, this.window);

        // Create current screen and overlay
        this.ingameOverlay = new IngameOverlay(this, this.window);

        this.frames = 0;
        this.lastTime = Date.now();

        // Create all blocks
        BlockRegistry.create();

        this.itemRenderer.initialize();

        // Create font renderer
        this.fontRenderer = new FontRenderer(this);

        // Grass colorizer
        this.grassColorizer = new GrassColorizer(this);

        // Update window size
        this.window.updateWindowSize();

        // Create sound manager
        this.soundManager = new SoundManager();

        this.displayScreen(new GuiMainMenu());

        // Initialize
        this.init();
    }

    init() {
        // Start render loop
        this.running = true;
        this.requestNextFrame();
    }

    loadWorld(world) {
        if (world === null) {
            this.worldRenderer.reset();
            this.itemRenderer.reset();

            this.world = null;
            this.player = null;
            this.loadingScreen = null;
            this.displayScreen(new GuiMainMenu());
        } else {
            // Display loading screen
            this.loadingScreen = new GuiLoadingScreen();
            this.loadingScreen.setTitle("Building terrain...");
            this.displayScreen(this.loadingScreen);

            // Create world
            this.world = world;
            this.worldRenderer.scene.add(this.world.group);

            // Create player
            this.player = new PlayerEntity(this, this.world);
            this.world.addEntity(this.player);

            // Load spawn chunks and respawn player
            this.world.findSpawn();
            this.world.loadSpawnChunks();
            this.player.respawn();
        }
    }

    hasInGameFocus() {
        return this.window.mouseLocked && this.currentScreen === null;
    }

    isInGame() {
        return this.world !== null && this.worldRenderer !== null && this.player !== null;
    }

    requestNextFrame() {
        requestAnimationFrame(() => {
            if (this.running) {
                this.requestNextFrame();
                this.onLoop();
            } else {
                this.window.close();
            }
        });
    }

    onLoop() {
        // Update the timer
        this.timer.advanceTime();

        // Call the tick to reach updates 20 per seconds
        for (let i = 0; i < this.timer.ticks; i++) {
            this.onTick();
        }

        // Render the game
        this.onRender(this.timer.partialTicks);

        // Increase rendered frame
        this.frames++;

        // Loop if a second passed
        while (Date.now() >= this.lastTime + 1000) {
            this.fps = this.frames;
            this.lastTime += 1000;
            this.frames = 0;
        }
    }

    onRender(partialTicks) {
        if (this.isInGame()) {
            // Player rotation
            if (!this.isPaused()) {
                this.player.turn(this.window.mouseMotionX, this.window.mouseMotionY);

                this.window.mouseMotionX = 0;
                this.window.mouseMotionY = 0;
            }

            // Update lights
            while (this.world.updateLights()) {
                // Empty
            }

            // Render the game
            if (this.hasInGameFocus()) {
                this.worldRenderer.render(partialTicks);
            }
        }

        // Render current screen
        this.screenRenderer.render(partialTicks);
        this.itemRenderer.render(partialTicks);
    }

    displayScreen(screen) {
        if (typeof screen === "undefined") {
            console.error("Tried to display an undefined screen");
            return;
        }

        // Close previous screen
        if (!(this.currentScreen === null)) {
            this.currentScreen.onClose();
        }

        // Switch screen
        this.currentScreen = screen;

        // Update window size
        this.window.updateWindowSize();

        // Initialize new screen
        if (screen === null) {
            this.window.requestFocus();
        } else {
            this.window.exitFocus();
            screen.setup(this, this.window.width, this.window.height);
        }

        // Update items
        this.itemRenderer.rebuildAllItems();
    }

    onTick() {
        if (this.isInGame() && !this.isPaused()) {
            // Tick world
            this.world.onTick();

            // Tick renderer
            this.worldRenderer.onTick();

            // Tick the player
            this.player.onUpdate();
        }

        // Tick the screen
        if (this.currentScreen !== null) {
            this.currentScreen.updateScreen();
        }

        // Update loading progress
        if (this.loadingScreen !== null && this.isInGame()) {
            let cameraChunkX = Math.floor(this.player.x) >> 4;
            let cameraChunkZ = Math.floor(this.player.z) >> 4;

            let renderDistance = WorldRenderer.RENDER_DISTANCE;
            let requiredChunks = Math.pow(renderDistance * 2 - 1, 2);
            let loadedChunks = this.world.chunks.size;

            // Load chunks and count
            setTimeout(() => {
                for (let x = -renderDistance + 1; x < renderDistance; x++) {
                    for (let z = -renderDistance + 1; z < renderDistance; z++) {
                        this.world.getChunkAt(cameraChunkX + x, cameraChunkZ + z);
                    }
                }
            }, 0);

            // Update progress
            let progress = 1 / requiredChunks * Math.max(0, loadedChunks - this.world.lightUpdateQueue.length / 1000);
            this.loadingScreen.setProgress(progress);

            // Finish loading
            if (progress >= 0.99) {
                this.loadingScreen = null;
                this.displayScreen(null);
            }
        }
    }

    onKeyPressed(button) {
        for (let i = 1; i <= 9; i++) {
            if (button === 'Digit' + i) {
                this.player.inventory.selectedSlotIndex = i - 1;
            }
        }

        if (button === this.settings.togglePerspective) {
            this.settings.thirdPersonView = (this.settings.thirdPersonView + 1) % 3;
            this.settings.save();
        }
    }

    onMouseClicked(button) {
        if (this.window.mouseLocked) {
            let hitResult = this.player.rayTrace(5, this.timer.partialTicks);

            // Destroy block
            if (button === 0) {
                if (hitResult != null) {
                    // Get previous block
                    let typeId = this.world.getBlockAt(hitResult.x, hitResult.y, hitResult.z);
                    let block = Block.getById(typeId);

                    if (typeId !== 0) {
                        let soundName = block.getSound().getBreakSound();

                        // Play sound
                        this.soundManager.playSound(
                            soundName,
                            hitResult.x + 0.5,
                            hitResult.y + 0.5,
                            hitResult.z + 0.5,
                            1.0,
                            1.0
                        );

                        // Destroy block
                        this.world.setBlockAt(hitResult.x, hitResult.y, hitResult.z, 0);
                    }
                }

                this.player.swingArm();
            }

            // Pick block
            if (button === 1) {
                if (hitResult != null) {
                    let typeId = this.world.getBlockAt(hitResult.x, hitResult.y, hitResult.z);
                    if (typeId !== 0) {
                        this.player.inventory.setItemInSelectedSlot(typeId);
                    }
                }
            }

            // Place block
            if (button === 2) {
                if (hitResult != null) {
                    let x = hitResult.x + hitResult.face.x;
                    let y = hitResult.y + hitResult.face.y;
                    let z = hitResult.z + hitResult.face.z;

                    let placedBoundingBox = new BoundingBox(x, y, z, x + 1, y + 1, z + 1);

                    // Don't place blocks if the player is standing there
                    if (!placedBoundingBox.intersects(this.player.boundingBox)) {
                        let typeId = this.player.inventory.getItemInSelectedSlot();

                        // Get previous block
                        let prevTypeId = this.world.getBlockAt(x, y, z);

                        if (typeId !== 0 && prevTypeId !== typeId) {
                            // Place block
                            this.world.setBlockAt(x, y, z, typeId);

                            // Swing player arm
                            this.player.swingArm();

                            // Handle block abilities
                            let block = Block.getById(typeId);
                            block.onBlockPlaced(this.world, x, y, z, hitResult.face);

                            // Play sound
                            let sound = block.getSound();
                            let soundName = sound.getStepSound();
                            this.soundManager.playSound(
                                soundName,
                                hitResult.x + 0.5,
                                hitResult.y + 0.5,
                                hitResult.z + 0.5,
                                1.0,
                                sound.getPitch() * 0.8
                            );
                        }
                    }
                }
            }
        }
    }

    onMouseScroll(delta) {
        if (this.isInGame()) {
            this.player.inventory.shiftSelectedSlot(delta);
        }
    }

    isPaused() {
        return !this.hasInGameFocus() && this.loadingScreen === null;
    }

    stop() {
        this.running = false;
        this.worldRenderer.reset();
        this.itemRenderer.reset();
        this.screenRenderer.reset();
    }

    getThreeTexture(id) {
        if (!(id in this.resources)) {
            console.error("Texture not found: " + id);
            return;
        }

        let image = this.resources[id];
        let canvas = document.createElement('canvas');
        let context = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        context.imageSmoothingEnabled = false;
        context.drawImage(image, 0, 0, image.width, image.height);
        return new THREE.CanvasTexture(canvas);
    }
}