window.IngameOverlay = class extends Gui {

    render(stack, mouseX, mouseY, partialTicks) {
        this.drawRect(stack, 0, 0, 500, 500, '#0000FF');
    }

}