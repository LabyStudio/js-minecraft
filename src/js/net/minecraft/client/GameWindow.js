window.GameWindow = class {

    constructor(minecraft, renderer, canvasWrapperId) {
        this.renderer = renderer;
        this.canvasWrapperId = canvasWrapperId;

        this.mouseMotionX = 0;
        this.mouseMotionY = 0;
        this.mouseLocked = false;

        // Add web renderer canvas to wrapper
        let canvas = renderer.canvasElement;
        document.getElementById(this.canvasWrapperId).appendChild(canvas);

        // Init
        this.onResize();

        // On resize
        let scope = this;
        window.addEventListener('resize', _ => scope.onResize(), false);

        // Request focus
        canvas.onclick = function () {
            canvas.requestPointerLock();
        }

        // Focus listener
        document.addEventListener('pointerlockchange', _ => this.onFocusChanged(), false);

        // Mouse motion
        document.addEventListener('mousemove', event => this.onMouseMove(event), false);

        // Mouse buttons
        document.addEventListener('click', event => minecraft.onMouseClicked(event.button), false);

        // Create keyboard
        Keyboard.create();
    }

    onResize() {
        // Get canvas size
        let canvasElement = document.getElementById(this.canvasWrapperId);
        this.canvasWidth = canvasElement.offsetWidth;
        this.canvasHeight = canvasElement.offsetHeight;

        // Adjust camera
        this.renderer.camera.aspect = this.canvasWidth / this.canvasHeight;
        this.renderer.camera.updateProjectionMatrix();
        this.renderer.webRenderer.setSize(this.canvasWidth, this.canvasHeight);
    }

    onFocusChanged() {
        this.mouseLocked = document.pointerLockElement === this.renderer.canvasElement;
    }

    onMouseMove(event) {
        this.mouseMotionX = event.movementX;
        this.mouseMotionY = -event.movementY;
    }
}