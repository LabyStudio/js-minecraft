import Gui from "./Gui.js";

export default class GuiScreen extends Gui {

    constructor() {
        super();

        this.buttonList = [];
        this.previousScreen = null;
    }

    setup(minecraft, width, height) {
        this.minecraft = minecraft;
        this.width = width;
        this.height = height;
        this.textureBackground = this.getTexture("gui/background.png");

        this.init();
    }

    init() {
        this.buttonList = [];
    }

    onClose() {

    }

    drawScreen(stack, mouseX, mouseY, partialTicks) {
        for (let i in this.buttonList) {
            let button = this.buttonList[i];
            button.minecraft = this.minecraft;
            button.render(stack, mouseX, mouseY, partialTicks);
        }
    }

    updateScreen() {
        for (let i in this.buttonList) {
            let button = this.buttonList[i];

            button.onTick();
        }
    }

    keyTyped(key, character) {
        if (key === "Escape") {
            this.minecraft.displayScreen(this.previousScreen);
            return true;
        }

        for (let i in this.buttonList) {
            let button = this.buttonList[i];

            button.keyTyped(key, character);
        }

        return false;
    }

    keyReleased(key) {
        for (let i in this.buttonList) {
            let button = this.buttonList[i];

            button.keyReleased(key);
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

    mouseReleased(mouseX, mouseY, mouseButton) {
        for (let i in this.buttonList) {
            let button = this.buttonList[i];

            button.mouseReleased(mouseX, mouseY, mouseButton);
        }
    }

    mouseDragged(mouseX, mouseY, mouseButton) {
        for (let i in this.buttonList) {
            let button = this.buttonList[i];

            button.mouseDragged(mouseX, mouseY, mouseButton);
        }
    }

    drawDefaultBackground(stack) {
        if (this.minecraft.isInGame()) {
            // Render transparent background
            this.drawRect(stack, 0, 0, this.width, this.height, 'black', 0.6);
        } else {
            // Render dirt background
            this.drawBackground(stack, this.textureBackground, this.width, this.height);
        }
    }
}