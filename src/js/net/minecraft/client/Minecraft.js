window.Minecraft = class {

    /**
     * Create Minecraft instance and render it on a canvas
     */
    constructor(canvasWrapperId) {
        this.worldRenderer = new WorldRenderer(this);
        this.window = new GameWindow(this, this.worldRenderer, canvasWrapperId);
        this.timer = new Timer(20);

        this.frames = 0;
        this.lastTime = Date.now();

        // Create all blocks
        Block.create();

        // Create world
        this.world = new World();
        this.worldRenderer.scene.add(this.world.group);

        // Create player
        this.player = new Player(this.world);
        this.pickedBlock = 1;

        // Initialize
        this.init();
    }

    init() {
        // Start render loop
        this.running = true;
        this.requestNextFrame();
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
        this.window.stats.begin();

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
            //console.log(this.frames + " fps");

            this.lastTime += 1000;
            this.frames = 0;
        }

        this.window.stats.end();
    }

    onRender(partialTicks) {
        // Player rotation
        if (this.window.mouseLocked) {
            this.player.turn(this.window.mouseMotionX, this.window.mouseMotionY);

            this.window.mouseMotionX = 0;
            this.window.mouseMotionY = 0;
        }

        // Render the game
        this.worldRenderer.render(partialTicks);
    }

    onTick() {
        // Tick world
        this.world.onTick();

        // Tick the player
        this.player.onTick();
    }

    onMouseClicked(button) {
        if (this.window.mouseLocked) {
            let hitResult = this.player.rayTrace(5, this.timer.partialTicks);

            // Destroy block
            if (button === 0) {
                if (hitResult != null) {
                    this.world.setBlockAt(hitResult.x, hitResult.y, hitResult.z, 0);
                    this.world.updateBlockLightAt(hitResult.x, hitResult.y, hitResult.z);
                }
            }

            // Pick block
            if (button === 1) {
                if (hitResult != null) {
                    let typeId = this.world.getBlockAt(hitResult.x, hitResult.y, hitResult.z);
                    if (typeId !== 0) {
                        this.pickedBlock = typeId;
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
                        this.world.setBlockAt(x, y, z, this.pickedBlock);
                        this.world.updateBlockLightAt(x, y, z);
                    }
                }
            }
        }
    }

}