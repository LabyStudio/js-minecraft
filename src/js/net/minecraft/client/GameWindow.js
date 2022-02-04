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

        // Losing focus event
        window.addEventListener("mouseout", function () {
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
            }
        });

        // Create keyboard
        Keyboard.create();
    }

    requestFocus() {
        let scope = this;

        setTimeout(function () {
            window.focus();
            scope.renderer.canvas.requestPointerLock();
        }, 0);
    }

    loadRenderer(renderer) {
        this.renderer = renderer;

        let canvas = this.renderer.canvas;

        // Add web renderer canvas to wrapper
        this.wrapper.appendChild(canvas);

        // Initialize window size
        this.onResize();

        // Request focus
        let scope = this;
        canvas.onclick = function () {
            if (scope.minecraft.currentScreen === null) {
                scope.requestFocus();
            }
        }
    }

    updateWindowSize() {
        this.scaleFactor = 1;
        this.width = this.wrapper.offsetWidth;
        this.height = this.wrapper.offsetHeight;

        for (this.scaleFactor = 1; this.width / (this.scaleFactor + 1) >= 320 && this.height / (this.scaleFactor + 1) >= 240; this.scaleFactor++) {
        }

        this.width = this.width / this.scaleFactor;
        this.height = this.height / this.scaleFactor;
    }

    onResize() {
        this.updateWindowSize();

        // Adjust camera
        this.renderer.camera.aspect = this.width / this.height;
        this.renderer.camera.updateProjectionMatrix();
        this.renderer.webRenderer.setSize(this.width * this.scaleFactor, this.height * this.scaleFactor);

        // Reinitialize gui
        this.renderer.initializeGui();

        // Reinitialize current screen
        if (!(this.minecraft.currentScreen === null)) {
            this.minecraft.currentScreen.setup(this.minecraft, this.width, this.height);
        }
    }

    onFocusChanged() {
        this.mouseLocked = document.pointerLockElement === this.renderer.canvas;
    }

    onMouseMove(event) {
        this.mouseMotionX = event.movementX;
        this.mouseMotionY = -event.movementY;

        this.mouseX = event.clientX / this.scaleFactor;
        this.mouseY = event.clientY / this.scaleFactor;

        if (!this.mouseLocked && this.minecraft.currentScreen === null) {
            this.requestFocus();
        }
    }

}