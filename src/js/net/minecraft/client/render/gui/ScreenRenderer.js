export default class ScreenRenderer {

    constructor(minecraft, window) {
        this.minecraft = minecraft;
        this.window = window;

        this.upscale = window.isMobileDevice() ? 1 : 4;
    }

    initialize() {
        this.resolution = this.minecraft.isInGame() ? 1 : this.minecraft.window.scaleFactor; // Increase resolution for the splash text

        // Update camera size
        this.window.canvas.width = this.window.width * this.upscale;
        this.window.canvas.height = this.window.height * this.upscale;

        // Get context stack of 2d canvas
        this.stack2d = this.window.canvas.getContext('2d');
        this.stack2d.webkitImageSmoothingEnabled = false;
        this.stack2d.mozImageSmoothingEnabled = false;
        this.stack2d.imageSmoothingEnabled = false;
    }

    render(partialTicks) {
        let mouseX = this.minecraft.window.mouseX;
        let mouseY = this.minecraft.window.mouseY;

        this.stack2d.save();

        // Draw world to canvas
        if (this.minecraft.isInGame()) {
            this.stack2d.drawImage(this.window.canvasWorld, 0, 0, this.window.width * this.upscale, this.window.height * this.upscale);
        } else {
            this.reset();
        }

        // Scale GUI
        this.stack2d.scale(this.upscale, this.upscale, this.upscale);

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

        // Scale GUI back
        this.stack2d.scale(1 / this.upscale, 1 / this.upscale, 1 / this.upscale);

        // Render items
        this.stack2d.drawImage(this.window.canvasItems, 0, 0);

        this.stack2d.restore();
    }

    reset() {
        this.stack2d.clearRect(0, 0, this.window.canvas.width, this.window.canvas.height);
    }

}