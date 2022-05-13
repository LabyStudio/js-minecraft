export default class ScreenRenderer {

    constructor(minecraft, window) {
        this.minecraft = minecraft;
        this.window = window;
    }

    initialize() {
        this.resolution = this.minecraft.isInGame() ? 1 : this.minecraft.window.scaleFactor; // Increase resolution for the splash text

        // Update camera size
        this.window.canvas2d.width = this.window.width * this.resolution;
        this.window.canvas2d.height = this.window.height * this.resolution;

        // Get context stack of 2d canvas
        this.stack2d = this.window.canvas2d.getContext('2d');
        this.stack2d.webkitImageSmoothingEnabled = false;
        this.stack2d.mozImageSmoothingEnabled = false;
        this.stack2d.imageSmoothingEnabled = false;
    }

    render(partialTicks) {
        let mouseX = this.minecraft.window.mouseX;
        let mouseY = this.minecraft.window.mouseY;

        this.stack2d.save();
        this.stack2d.scale(this.resolution, this.resolution, this.resolution);

        // Reset 2d canvas
        this.stack2d.clearRect(0, 0, this.window.width, this.window.height);

        try {
            // Render in-game overlay
            if (this.minecraft.isInGame() && this.minecraft.loadingScreen === null) {
                this.minecraft.ingameOverlay.render(this.stack2d, mouseX, mouseY, partialTicks);
            }

            // Render current screen
            if (this.minecraft.currentScreen !== null) {
                this.minecraft.currentScreen.drawScreen(this.stack2d, mouseX, mouseY, partialTicks)
            }
        } catch (e) {
            console.error(e);
        }

        this.stack2d.restore();
    }

    reset() {
        this.stack2d.clearRect(0, 0, this.window.canvas2d.width, this.window.canvas2d.height);
    }

}