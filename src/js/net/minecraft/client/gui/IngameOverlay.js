window.IngameOverlay = class extends Gui {

    constructor(window) {
        super();
        this.window = window;

        this.textureCrosshair = this.loadTexture("icons.png");
    }

    render(stack, mouseX, mouseY, partialTicks) {
        this.renderCrosshair(stack, this.window.width / 2, this.window.height / 2)
    }

    renderCrosshair(stack, x, y) {
        let size = 15 * 4;
        this.drawSprite(stack, this.textureCrosshair, 0, 0, 15, 15, x - size / 2, y - size / 2, size, size, 0.6);
    }

}