import Timer from "../util/Timer.js";
import GameSettings from "./GameSettings.js";
import GameWindow from "./GameWindow.js";
import WorldRenderer from "./render/WorldRenderer.js";
import ScreenRenderer from "./render/gui/ScreenRenderer.js";
import ItemRenderer from "./render/gui/ItemRenderer.js";
import IngameOverlay from "./gui/IngameOverlay.js";
import GuiLoadingScreen from "./gui/screens/GuiLoadingScreen.js";
import PlayerEntity from "./entity/PlayerEntity.js";
import SoundManager from "./sound/SoundManager.js";
import World from "./world/World.js";
import Block from "./world/block/Block.js";
import BoundingBox from "../util/BoundingBox.js";
import {BlockRegistry} from "./world/block/BlockRegistry.js";
import FontRenderer from "./render/gui/FontRenderer.js";

export default class Minecraft {

    /**
     * Create Minecraft instance and render it on a canvas
     */
    constructor(canvasWrapperId, resources) {
        this.resources = resources;

        this.currentScreen = null;
        this.loadingScreen = null;

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

        // Display loading screen
        this.loadingScreen = new GuiLoadingScreen();
        this.loadingScreen.setTitle("Building terrain...");

        this.frames = 0;
        this.lastTime = Date.now();

        // Create all blocks
        BlockRegistry.create();

        this.itemRenderer.initialize();

        // Create font renderer
        this.fontRenderer = new FontRenderer(this);

        // Update window size
        this.window.updateWindowSize();

        // Create world
        this.world = new World(this);
        this.worldRenderer.scene.add(this.world.group);

        // Create sound manager
        this.soundManager = new SoundManager();

        // Create player
        this.player = new PlayerEntity(this, this.world);
        this.world.addEntity(this.player);

        this.displayScreen(this.loadingScreen);

        // Initialize
        this.init();
    }

    init() {
        // Load spawn chunk
        for (let x = -WorldRenderer.RENDER_DISTANCE; x <= WorldRenderer.RENDER_DISTANCE; x++) {
            for (let z = -WorldRenderer.RENDER_DISTANCE; z <= WorldRenderer.RENDER_DISTANCE; z++) {
                this.world.getChunkAt(x, z);
            }
        }
        this.player.respawn();

        // Start render loop
        this.running = true;
        this.requestNextFrame();
    }

    hasInGameFocus() {
        return this.window.mouseLocked && this.currentScreen === null;
    }

    requestNextFrame() {
        let scope = this;
        requestAnimationFrame(function () {
            if (scope.running) {
                scope.requestNextFrame();
                scope.onLoop();
            }
        });
    }

    onLoop() {
        this.window.statsFps.begin();
        this.window.statsMs.begin();

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

        this.window.statsFps.end();
        this.window.statsMs.end();
    }

    onRender(partialTicks) {
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
        this.screenRenderer.render(partialTicks);
        this.itemRenderer.render(partialTicks);
    }

    displayScreen(screen) {
        if (typeof screen === "undefined") {
            console.log("Tried to display an undefined screen");
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
        if (!this.isPaused()) {
            // Tick world
            this.world.onTick();

            // Tick renderer
            this.worldRenderer.onTick();

            // Tick the player
            this.player.onUpdate();
        }

        // Update loading progress
        if (!(this.loadingScreen === null)) {
            let progress = Math.max(0, 1 - this.world.lightUpdateQueue.length / 10000);
            this.loadingScreen.setProgress(progress);

            // Finish loading
            if (progress >= 1) {
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
        this.player.inventory.shiftSelectedSlot(delta);
    }

    isPaused() {
        return !this.hasInGameFocus() && this.loadingScreen === null;
    }
}