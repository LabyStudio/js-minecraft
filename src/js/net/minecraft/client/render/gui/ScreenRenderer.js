window.ScreenRenderer = class {

    constructor(minecraft, window) {
        this.minecraft = minecraft;
        this.window = window;
    }

    initialize() {
        // Update camera size
        this.window.canvas2d.width = this.window.width;
        this.window.canvas2d.height = this.window.height;

        // Get context stack of 2d canvas
        this.stack2d = this.window.canvas2d.getContext('2d');
        this.stack2d.webkitImageSmoothingEnabled = false;
        this.stack2d.mozImageSmoothingEnabled = false;
        this.stack2d.imageSmoothingEnabled = false;
    }

    render(partialTicks) {
        let mouseX = this.minecraft.window.mouseX;
        let mouseY = this.minecraft.window.mouseY;

        // Reset 2d canvas
        this.stack2d.clearRect(0, 0, this.window.width, this.window.height);

        // Render in-game overlay
        this.minecraft.ingameOverlay.render(this.stack2d, mouseX, mouseY, partialTicks);

        // Render current screen
        if (!(this.minecraft.currentScreen === null)) {
            this.minecraft.currentScreen.drawScreen(this.stack2d, mouseX, mouseY, partialTicks);
        }
    }

}