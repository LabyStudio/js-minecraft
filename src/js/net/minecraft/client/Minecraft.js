window.Minecraft = class {

    /**
     * Create Minecraft instance and render it on a canvas
     */
    constructor(canvasWrapperId) {
        this.currentScreen = null;
        this.loadingScreen = null;

        this.fps = 0;

        // Tick timer
        this.timer = new Timer(20);

        this.settings = new GameSettings();

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
        Block.create();

        this.itemRenderer.initialize();

        // Update window size
        this.window.updateWindowSize();

        // Create world
        this.world = new World(this);
        this.worldRenderer.scene.add(this.world.group);

        // Create player
        this.player = new Player(this, this.world);
        this.inventory = new Inventory();

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
    }

    onTick() {
        if (!this.isPaused()) {
            // Tick world
            this.world.onTick();

            // Tick the player
            this.player.onTick();
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
                this.inventory.selectedSlotIndex = i - 1;
            }
        }
    }

    onMouseClicked(button) {
        if (this.window.mouseLocked) {
            let hitResult = this.player.rayTrace(5, this.timer.partialTicks);

            // Destroy block
            if (button === 0) {
                if (hitResult != null) {
                    this.world.setBlockAt(hitResult.x, hitResult.y, hitResult.z, 0);
                }
            }

            // Pick block
            if (button === 1) {
                if (hitResult != null) {
                    let typeId = this.world.getBlockAt(hitResult.x, hitResult.y, hitResult.z);
                    if (typeId !== 0) {
                        this.inventory.setItemInSelectedSlot(typeId);
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
                        let typeId = this.inventory.getItemInSelectedSlot();
                        if (typeId !== 0) {
                            this.world.setBlockAt(x, y, z, typeId);
                        }
                    }
                }
            }
        }
    }

    onMouseScroll(delta) {
        this.inventory.shiftSelectedSlot(delta);
    }

    isPaused() {
        return false;
        //return !this.hasInGameFocus() && this.loadingScreen === null;
    }
}