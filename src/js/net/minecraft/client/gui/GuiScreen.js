window.GuiScreen = class extends Gui {

    init(minecraft, width, height) {
        this.minecraft = minecraft;
        this.width = width;
        this.height = height;
    }

    drawScreen(stack, mouseX, mouseY, partialTicks) {

    }

    keyTyped(code) {
        if (code === "Escape") {
            this.minecraft.displayScreen(null);
            return true;
        }
        return false;
    }

}