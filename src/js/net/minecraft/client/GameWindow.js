window.GameWindow = class {

    constructor(minecraft, canvasWrapperId) {
        this.canvasWrapperId = canvasWrapperId;

        this.mouseMotionX = 0;
        this.mouseMotionY = 0;
        this.mouseLocked = false;

        this.wrapper = document.getElementById(this.canvasWrapperId);

        // Stats
        this.stats = new Stats()
        this.stats.showPanel(0);
        this.wrapper.appendChild(this.stats.dom);

        // Initialize window size
        this.updateWindowSize();

        // On resize
        let scope = this;
        window.addEventListener('resize', _ => scope.onResize(), false);

        // Focus listener
        document.addEventListener('pointerlockchange', _ => this.onFocusChanged(), false);

        // Mouse motion
        document.addEventListener('mousemove', event => this.onMouseMove(event), false);

        // Mouse buttons
        document.addEventListener('click', event => minecraft.onMouseClicked(event.button), false);

        // Create keyboard
        Keyboard.create();
    }

    loadRenderer(renderer) {
        this.renderer = renderer;

        let canvas = renderer.canvasElement;

        // Add web renderer canvas to wrapper
        this.wrapper.appendChild(canvas);

        // Initialize window size
        this.onResize();

        // Request focus
        canvas.onclick = function () {
            canvas.requestPointerLock();
        }
    }

    updateWindowSize() {
        this.width = this.wrapper.offsetWidth;
        this.height = this.wrapper.offsetHeight;
    }

    onResize() {
        this.updateWindowSize();

        // Adjust camera
        this.renderer.camera.aspect = this.width / this.height;
        this.renderer.camera.updateProjectionMatrix();
        this.renderer.webRenderer.setSize(this.width, this.height);

        // Reinitialize gui
        this.renderer.initializeGui();
    }

    onFocusChanged() {
        this.mouseLocked = document.pointerLockElement === this.renderer.canvasElement;
    }

    onMouseMove(event) {
        this.mouseMotionX = event.movementX;
        this.mouseMotionY = -event.movementY;
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

}