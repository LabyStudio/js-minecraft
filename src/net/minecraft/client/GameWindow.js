window.GameWindow = class {

    constructor(renderer, canvasWrapperId) {
        this.renderer = renderer;
        this.canvasWrapperId = canvasWrapperId;

        this.mouseMotionX = 0;
        this.mouseMotionY = 0;
        this.mouseLocked = false;

        // Add web renderer canvas to wrapper
        let canvas = renderer.canvasElement;
        document.getElementById(this.canvasWrapperId).appendChild(canvas);

        // Init
        this.initialize();

        // On resize
        let scope = this;
        window.addEventListener('resize', _ => scope.initialize(), false);

        // Request focus
        canvas.onclick = function () {
            canvas.requestPointerLock();
        }

        // Focus listener
        document.addEventListener('pointerlockchange', _ => this.onFocusChanged(), false);

        // Mouse motion
        document.addEventListener('mousemove', event => this.onMouseMove(event), false);
    }

    initialize() {
        // Create keyboard
        Keyboard.create();

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
        this.mouseMotionX = -event.movementX;
        this.mouseMotionY = event.movementY;
    }
}