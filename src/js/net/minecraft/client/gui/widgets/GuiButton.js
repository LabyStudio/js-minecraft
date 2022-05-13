import Gui from "../Gui.js";

export default class GuiButton extends Gui {

    constructor(string, x, y, width, height, callback) {
        super();

        this.string = string;
        this.enabled = true;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.callback = callback;
    }

    render(stack, mouseX, mouseY, partialTicks) {
        let mouseOver = this.isMouseOver(mouseX, mouseY);
        this.drawButton(stack, this.enabled, mouseOver, this.x, this.y, this.width, this.height);
        this.drawCenteredString(stack, this.string, this.x + this.width / 2, this.y + this.height / 2 - 4);
    }

    onPress() {
        if (this.enabled) {
            this.callback();
        }
    }

    onTick() {

    }

    mouseClicked(mouseX, mouseY, mouseButton) {
        this.onPress();
    }

    mouseReleased(mouseX, mouseY, mouseButton) {

    }

    mouseDragged(mouseX, mouseY, mouseButton) {

    }

    keyTyped(key, character) {

    }

    keyReleased(key) {

    }

    isMouseOver(mouseX, mouseY) {
        return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height;
    }

    drawButton(stack, enabled, mouseOver, x, y, width, height) {
        let textureGui = this.getTexture("gui/gui.png");
        let spriteY = 66 + (enabled ? (mouseOver ? 20 : 0) : -20);

        this.drawSprite(stack, textureGui, 0, spriteY, width / 2, 20, x, y, width / 2, height);
        this.drawSprite(stack, textureGui, 200 - width / 2, spriteY, width / 2, 20, x + width / 2, y, width / 2, height);
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        return this;
    }

}