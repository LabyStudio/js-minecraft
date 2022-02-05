window.GuiScreen = class extends Gui {

    constructor() {
        super();

        this.buttonList = [];
    }

    setup(minecraft, width, height) {
        this.minecraft = minecraft;
        this.width = width;
        this.height = height;

        this.init();
    }

    init() {
        this.buttonList = [];
    }

    drawScreen(stack, mouseX, mouseY, partialTicks) {
        for (let i in this.buttonList) {
            let button = this.buttonList[i];
            button.render(stack, mouseX, mouseY, partialTicks);
        }
    }

    keyTyped(key) {
        if (key === "Escape") {
            this.minecraft.displayScreen(null);
            return true;
        }

        for (let i in this.buttonList) {
            let button = this.buttonList[i];

            button.keyTyped(key);
        }

        return false;
    }

    mouseClicked(mouseX, mouseY, mouseButton) {
        for (let i in this.buttonList) {
            let button = this.buttonList[i];

            if (button.isMouseOver(mouseX, mouseY)) {
                button.mouseClicked(mouseX, mouseY, mouseButton);
            }
        }
    }

}