window.Minecraft = class {

    /**
     * Create Minecraft instance and render it on a canvas
     */
    constructor(canvasWrapperId) {
        this.worldRenderer = new WorldRenderer(this);
        this.window = new GameWindow(this.worldRenderer, canvasWrapperId);
        this.timer = new Timer(20);

        this.frames = 0;
        this.lastTime = Date.now();

        // Create world
        this.world = new World();
        this.worldRenderer.scene.add(this.world.group);

        // Create player
        this.player = new Player(this.world);

        // Initialize
        this.init();
    }

    init() {
        // Create all blocks
        Block.create();

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
    }

    onRender(partialTicks) {
        if (this.window.mouseLocked) {
            this.player.turn(this.window.mouseMotionX, this.window.mouseMotionY);

            this.window.mouseMotionX = 0;
            this.window.mouseMotionY = 0;
        }

        // Render the game
        this.worldRenderer.render(partialTicks);
    }

    onTick() {
        this.player.onTick();
    }

}