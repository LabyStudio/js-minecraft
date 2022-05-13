import GuiIngameMenu from "./gui/screens/GuiIngameMenu.js";
import Keyboard from "../util/Keyboard.js";
import Minecraft from "./Minecraft.js";

export default class GameWindow {

    constructor(minecraft, canvasWrapperId) {
        this.minecraft = minecraft;
        this.canvasWrapperId = canvasWrapperId;

        this.mouseMotionX = 0;
        this.mouseMotionY = 0;
        this.mouseLocked = false;
        this.actualMouseLocked = false;

        this.isMobile = this.detectTouchDevice();

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

        let mouseDownInterval = null;

        // Request focus
        document.onclick = () => {
            if (this.minecraft.currentScreen === null) {
                this.requestFocus();
            }
        }

        window.addEventListener('resize', _ => this.updateWindowSize(), false);

        // Focus listener
        document.addEventListener('pointerlockchange', _ => this.onFocusChanged(), false);

        // Mouse motion
        document.addEventListener('mousemove', event => {
            this.onMouseMove(event);

            // Handle mouse move on screen
            if (!(minecraft.currentScreen === null)) {
                minecraft.currentScreen.mouseDragged(event.x / this.scaleFactor, event.y / this.scaleFactor, event.code);
            }
        }, false);

        // Mouse release
        document.addEventListener('mouseup', event => {
            // Handle mouse release on screen
            if (!(minecraft.currentScreen === null)) {
                minecraft.currentScreen.mouseReleased(event.x / this.scaleFactor, event.y / this.scaleFactor, event.code);
            }

            clearInterval(mouseDownInterval);
        }, false);

        // Losing focus event
        this.canvas.addEventListener("mouseout", () => {
            if (minecraft.currentScreen === null) {
                minecraft.displayScreen(new GuiIngameMenu());
            }

            clearInterval(mouseDownInterval);
        });

        // Mouse buttons
        document.addEventListener('mousedown', event => {
            // Create sound engine (It has to be created after user interaction)
            if (!minecraft.soundManager.isCreated()) {
                minecraft.soundManager.create(minecraft.worldRenderer);
            }

            // Handle in-game mouse click
            if (!this.isMobile) {
                minecraft.onMouseClicked(event.button);

                // Start interval to repeat the mouse event
                clearInterval(mouseDownInterval);
                mouseDownInterval = setInterval(() => minecraft.onMouseClicked(event.button), 250);
            }

            // Handle mouse click on screen
            if (!(minecraft.currentScreen === null)) {
                minecraft.currentScreen.mouseClicked(event.x / this.scaleFactor, event.y / this.scaleFactor, event.code);
            }
        }, false);

        // Mouse scroll
        document.addEventListener('wheel', (event) => {
            let delta = Math.sign(event.deltaY);
            minecraft.onMouseScroll(delta);
        }, false);

        // Keyboard interaction with screen
        window.addEventListener('keydown', (event) => {
            if (event.code === "F11") {
                return; // Toggle fullscreen
            }

            // Prevent key
            event.preventDefault();

            if (!(minecraft.currentScreen === null)) {
                // Handle key type on screen
                minecraft.currentScreen.keyTyped(event.code, event.key);
            } else if (event.code === 'Escape') {
                minecraft.displayScreen(new GuiIngameMenu());
            } else {
                minecraft.onKeyPressed(event.code);
            }
        });

        // Keyboard interaction with screen
        window.addEventListener('keyup', (event) => {
            // Prevent key
            event.preventDefault();

            if (!(minecraft.currentScreen === null)) {
                // Handle key release on screen
                minecraft.currentScreen.keyReleased(event.code);
            }
        });

        // Touch interaction
        let touchStart;
        window.addEventListener('touchstart', (event) => {
            for (let i = 0; i < event.touches.length; i++) {
                let touch = event.touches[i];

                let x = touch.pageX;
                let y = touch.pageY;

                let isRightHand = x > this.wrapper.offsetWidth / 2;

                if (isRightHand) {
                    touchStart = Date.now();
                } else {
                    let tileSize = this.wrapper.offsetWidth / 8;

                    let tileX = 0;
                    let tileY = this.wrapper.offsetHeight - tileSize * 3;

                    let relX = x - tileX;
                    let relY = y - tileY;

                    let tileIndex = Math.floor(relX / tileSize) + Math.floor(relY / tileSize) * 3;

                    // Walk buttons
                    switch (tileIndex) {
                        case 0:
                        case 1:
                        case 2:
                            Keyboard.setState("KeyW", true);
                            break;
                        case 3:
                            Keyboard.setState("KeyA", true);
                            break;
                        case 4:
                            Keyboard.setState("Space", true);
                            break;
                        case 5:
                            Keyboard.setState("KeyD", true);
                            break;
                        case 6:
                        case 7:
                        case 8:
                            Keyboard.setState("KeyS", true);
                            break;
                    }
                }
            }

            // Create sound engine (It has to be created after user interaction)
            if (!minecraft.soundManager.isCreated()) {
                minecraft.soundManager.create(minecraft.worldRenderer);
            }
        });

        // Touch movement
        let prevTouch;
        window.addEventListener('touchmove', (event) => {
            for (let i = 0; i < event.touches.length; i++) {
                let touch = event.touches[i];

                let x = touch.pageX;
                let y = touch.pageY;

                // Right hand
                let isRightHand = x > this.wrapper.offsetWidth / 2;

                if (isRightHand) {
                    // Player movement
                    if (prevTouch) {
                        this.mouseMotionX = (x - prevTouch.pageX) * 10;
                        this.mouseMotionY = -(y - prevTouch.pageY) * 10;
                    }

                    prevTouch = touch;
                }
            }
        });
        window.addEventListener('touchend', (event) => {
            // Break block
            if (!prevTouch && touchStart && (Date.now() - touchStart) < 1000) {
                minecraft.onMouseClicked(2);
            }

            prevTouch = null;
            touchStart = null;

            // Stop pressing keys
            for (let i = 0; i < event.changedTouches.length; i++) {
                let touch = event.changedTouches[i];

                // Left hand
                let isLeftHand = touch.pageX < this.wrapper.offsetWidth / 2;

                // Release all keys
                if (isLeftHand) {
                    Keyboard.unPressAll();
                    break;
                }
            }
        });

        // Break block listener
        if (this.isMobile) {
            setInterval(() => {
                if (touchStart && (Date.now() - touchStart) > 1000) {
                    touchStart = Date.now();
                    minecraft.onMouseClicked(0);
                }
            }, 200);
        }

        // Create keyboard
        Keyboard.create();
    }

    requestFocus() {
        if (this.isMobile) {
            document.body.requestFullscreen();
        } else {
            window.focus();
            this.canvas.requestPointerLock();
            document.body.style.cursor = 'none';
        }

        this.mouseLocked = true;
    }

    exitFocus() {
        if (this.isMobile) {
            return;
        }

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

    detectTouchDevice() {
        let match = window.matchMedia || window.msMatchMedia;
        if (match) {
            let mq = match("(pointer:coarse)");
            return mq.matches;
        }
        return false;
    }

    close() {
        this.openUrl(Minecraft.URL_GITHUB);
    }

    openUrl(url, newTab) {
        if (newTab) {
            window.open(url, '_blank').focus();
        } else {
            window.location = url;
        }
    }

    async getClipboardText() {
        return navigator.clipboard.readText();
    }

}