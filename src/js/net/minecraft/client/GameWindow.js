window.GameWindow = class {

    constructor(minecraft, canvasWrapperId) {
        this.minecraft = minecraft;
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

        // Keyboard interaction with screen
        window.addEventListener('keydown', function (event) {
            if (!(minecraft.currentScreen === null)) {
                // Handle key type on screen
                let consumed = minecraft.currentScreen.keyTyped(event.code);

                if (consumed) {
                    // Cancel browser interaction
                    event.preventDefault();
                }
            }
        });

        // Create keyboard
        Keyboard.create();
    }

    requestFocus() {
        this.renderer.canvasElement.requestPointerLock();
    }

    loadRenderer(renderer) {
        this.renderer = renderer;

        let canvas = this.renderer.canvasElement;

        // Add web renderer canvas to wrapper
        this.wrapper.appendChild(canvas);

        // Initialize window size
        this.onResize();

        // Request focus
        let minecraft = this.minecraft;
        canvas.onclick = function () {
            if (minecraft.currentScreen === null) {
                canvas.requestPointerLock();
            }
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

        // Reinitialize current screen
        if (!(this.minecraft.currentScreen === null)) {
            this.minecraft.currentScreen.init(this.minecraft, this.width, this.height);
        }
    }

    onFocusChanged() {
        this.mouseLocked = document.pointerLockElement === this.renderer.canvasElement;

        // Open in-game menu
        if (!this.mouseLocked && this.minecraft.currentScreen === null) {
            this.minecraft.displayScreen(new GuiIngameMenu());
        }
    }

    onMouseMove(event) {
        this.mouseMotionX = event.movementX;
        this.mouseMotionY = -event.movementY;

        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

}