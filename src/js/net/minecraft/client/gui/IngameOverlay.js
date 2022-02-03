window.IngameOverlay = class extends Gui {

    render(stack, mouseX, mouseY, partialTicks) {
        this.drawRect(stack, 0, 0, 10, 10, '#0000FF');
    }

}