import Gui from "../Gui.js";

export default class GuiButton extends Gui {

    constructor(string, x, y, width, height, callback) {
        super();

        this.string = string;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.callback = callback;
    }

    render(stack, mouseX, mouseY, partialTicks) {
        let textureGui = this.getTexture("gui/gui.png");

        let mouseOver = this.isMouseOver(mouseX, mouseY);
        this.drawSprite(stack, textureGui, 0, 66 + (mouseOver ? 20 : 0), 200, 20, this.x, this.y, this.width, this.height);
        this.drawCenteredString(stack, this.string, this.x + this.width / 2, this.y + this.height / 2 - 4);
    }

    onPress() {
        this.callback();
    }

    mouseClicked(mouseX, mouseY, mouseButton) {
        this.onPress();
    }

    keyTyped(key) {

    }

    isMouseOver(mouseX, mouseY) {
        return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height;
    }

}