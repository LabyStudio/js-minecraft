window.GameWindow = class {

    constructor(minecraft, canvasWrapperId) {
        this.minecraft = minecraft;
        this.canvasWrapperId = canvasWrapperId;

        this.mouseMotionX = 0;
        this.mouseMotionY = 0;
        this.mouseLocked = false;
        this.actualMouseLocked = false;

        // Get canvas wrapper
        this.wrapper = document.getElementById(this.canvasWrapperId);

        // Create world renderer
        this.canvas = document.createElement('canvas');
        this.wrapper.appendChild(this.canvas);

        // Create screen renderer
        this.canvas2d = document.createElement('canvas');
        this.wrapper.appendChild(this.canvas2d);

        // Create screen item renderer
        this.canvasItems = document.createElement('canvas');
        this.wrapper.appendChild(this.canvasItems);

        // Stats
        this.statsFps = new Stats()
        this.statsFps.showPanel(0);
        this.statsFps.domElement.style.cssText = 'position:absolute;top:0px;right:80px;float:right';
        //this.wrapper.appendChild(this.statsFps.dom);

        this.statsMs = new Stats()
        this.statsMs.showPanel(1);
        this.statsMs.domElement.style.cssText = 'position:absolute;top:0px;right:160px;float:right';
        //this.wrapper.appendChild(this.statsMs.dom);

        // On resize
        let scope = this;

        // Request focus
        document.onclick = function () {
            if (scope.minecraft.currentScreen === null) {
                scope.requestFocus();
            }
        }

        window.addEventListener('resize', _ => scope.updateWindowSize(), false);

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
            // Create sound engine (It has to be created after user interaction)
            if(!minecraft.soundManager.isCreated()) {
                minecraft.soundManager.create(minecraft.worldRenderer);
            }

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
            event.preventDefault();

            if (!(minecraft.currentScreen === null)) {
                // Handle key type on screen
                minecraft.currentScreen.keyTyped(event.code);
            } else if (event.code === 'Escape') {
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

    updateWindowSize() {
        this.updateScaleFactor();

        let wrapperWidth = this.width * this.scaleFactor;
        let wrapperHeight = this.height * this.scaleFactor;

        let worldRenderer = this.minecraft.worldRenderer;
        let itemRenderer = this.minecraft.itemRenderer;

        // Update world renderer size and camera
        worldRenderer.camera.aspect = this.width / this.height;
        worldRenderer.camera.updateProjectionMatrix();
        worldRenderer.webRenderer.setSize(wrapperWidth, wrapperHeight);

        // Update item renderer size and camera
        itemRenderer.camera.aspect = this.width / this.height;
        itemRenderer.camera.updateProjectionMatrix();
        itemRenderer.webRenderer.setSize(wrapperWidth, wrapperHeight);

        // Update canvas 2d size
        this.canvas2d.style.width = wrapperWidth + "px";
        this.canvas2d.style.height = wrapperHeight + "px";

        // Reinitialize gui
        this.minecraft.screenRenderer.initialize();

        // Reinitialize current screen
        if (!(this.minecraft.currentScreen === null)) {
            this.minecraft.currentScreen.setup(this.minecraft, this.width, this.height);
        }
    }

    updateScaleFactor() {
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

    onFocusChanged() {
        this.actualMouseLocked = document.pointerLockElement === this.canvas;
    }

    onMouseMove(event) {
        this.mouseX = event.clientX / this.scaleFactor;
        this.mouseY = event.clientY / this.scaleFactor;

        if (document.pointerLockElement !== this.canvas) {
            this.mouseLocked = false;

            if (this.minecraft.currentScreen === null) {
                this.requestFocus();
            }
        }

        if (this.actualMouseLocked || this.mouseLocked) {
            this.mouseMotionX = event.movementX;
            this.mouseMotionY = -event.movementY;
        }
    }

}