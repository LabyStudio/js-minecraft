window.GameWindow = class {

    constructor(minecraft, renderer, canvasWrapperId) {
        this.renderer = renderer;
        this.canvasWrapperId = canvasWrapperId;

        this.mouseMotionX = 0;
        this.mouseMotionY = 0;
        this.mouseLocked = false;

        let wrapper = document.getElementById(this.canvasWrapperId);

        // Stats
        this.stats = new Stats()
        this.stats.showPanel(0);
        wrapper.appendChild(this.stats.dom);

        // Add web renderer canvas to wrapper
        let canvas = renderer.canvasElement;
        wrapper.appendChild(canvas);

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
        this.width = canvasElement.offsetWidth;
        this.height = canvasElement.offsetHeight;

        // Adjust camera
        this.renderer.camera.aspect = this.width / this.height;
        this.renderer.camera.updateProjectionMatrix();
        this.renderer.webRenderer.setSize(this.width, this.height);

        // Update HUD camera
        this.renderer.camera2D.left = -this.width / 2;
        this.renderer.camera2D.right = this.width / 2;
        this.renderer.camera2D.top = this.height / 2;
        this.renderer.camera2D.bottom = -this.height / 2;
        this.renderer.camera2D.updateProjectionMatrix();

        console.log("Resize");
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