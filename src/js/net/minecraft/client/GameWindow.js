window.GameWindow = class {

    constructor(minecraft, canvasWrapperId) {
        this.minecraft = minecraft;
        this.canvasWrapperId = canvasWrapperId;
        this.renderer = null;

        this.mouseMotionX = 0;
        this.mouseMotionY = 0;
        this.mouseLocked = false;

        // Get canvas wrapper
        this.wrapper = document.getElementById(this.canvasWrapperId);

        // Create world renderer
        this.canvas = document.createElement('canvas');
        this.wrapper.appendChild(this.canvas);

        // Create screen renderer
        this.canvas2d = document.createElement('canvas');
        this.wrapper.appendChild(this.canvas2d);

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

        // Losing focus event
        this.canvas.addEventListener("mouseout", function () {
            if (minecraft.currentScreen === null) {
                minecraft.displayScreen(new GuiIngameMenu());
            }
        });

        // Mouse buttons
        document.addEventListener('click', function (event) {
            // Handle in-game mouse click
            minecraft.onMouseClicked(event.button);

            // Handle mouse click on screen
            if (!(minecraft.currentScreen === null)) {
                minecraft.currentScreen.mouseClicked(event.x / scope.scaleFactor, event.y / scope.scaleFactor, event.code);
            }
        }, false);

        // Mouse scroll
        document.addEventListener('wheel', function (event) {
            let delta = Math.sign(event.deltaY);
            minecraft.onMouseScroll(delta);
        }, false);

        // Keyboard interaction with screen
        window.addEventListener('keydown', function (event) {
            if (!(minecraft.currentScreen === null)) {
                // Handle key type on screen
                let consumed = minecraft.currentScreen.keyTyped(event.code);

                if (consumed) {
                    // Cancel browser interaction
                    event.preventDefault();
                }
            } else if (event.code === 'Escape') {
                event.preventDefault();
                minecraft.displayScreen(new GuiIngameMenu());
            } else {
                minecraft.onKeyPressed(event.code);
            }
        });

        // Create keyboard
        Keyboard.create();
    }

    requestFocus() {
        window.focus();
        this.canvas.requestPointerLock();
        document.body.style.cursor = 'none';
        this.mouseLocked = true;
    }

    exitFocus() {
        document.exitPointerLock();
        document.body.style.cursor = 'default';
    }

    loadRenderer(renderer) {
        this.renderer = renderer;

        // Initialize window size
        this.onResize();

        // Request focus
        let scope = this;
        document.onclick = function () {
            if (scope.minecraft.currentScreen === null) {
                scope.requestFocus();
            }
        }
    }

    updateWindowSize() {
        let wrapperWidth = this.wrapper.offsetWidth;
        let wrapperHeight = this.wrapper.offsetHeight;

        let scale;
        for (scale = 1; wrapperWidth / (scale + 1) >= 320 && wrapperHeight / (scale + 1) >= 240; scale++) {
            // Empty
        }

        this.scaleFactor = scale;
        this.width = wrapperWidth / scale;
        this.height = wrapperHeight / scale;
    }

    onResize() {
        this.updateWindowSize();

        let wrapperWidth = this.width * this.scaleFactor;
        let wrapperHeight = this.height * this.scaleFactor;

        // Update world renderer size and camera
        this.renderer.camera.aspect = this.width / this.height;
        this.renderer.camera.updateProjectionMatrix();
        this.renderer.webRenderer.setSize(wrapperWidth, wrapperHeight);

        // Update canvas 2d size
        this.canvas2d.style.width = wrapperWidth + "px";
        this.canvas2d.style.height = wrapperHeight + "px";

        // Reinitialize gui
        this.renderer.initializeGui();

        // Reinitialize current screen
        if (!(this.minecraft.currentScreen === null)) {
            this.minecraft.currentScreen.setup(this.minecraft, this.width, this.height);
        }
    }

    onFocusChanged() {
        this.mouseLocked = document.pointerLockElement === this.canvas;
    }

    onMouseMove(event) {
        this.mouseMotionX = event.movementX;
        this.mouseMotionY = -event.movementY;

        this.mouseX = event.clientX / this.scaleFactor;
        this.mouseY = event.clientY / this.scaleFactor;

        if (document.pointerLockElement !== this.canvas && this.minecraft.currentScreen === null) {
            this.requestFocus();
        }
    }

}