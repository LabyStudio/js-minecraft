window.GuiButton = class extends Gui {

    static textureGui = Gui.loadTexture("gui.png");

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
        let mouseOver = this.isMouseOver(mouseX, mouseY);
        this.drawSprite(stack, GuiButton.textureGui, 0, mouseOver ? 40 : 20, 200, 20, this.x, this.y, this.width, this.height);
        this.drawCenteredString(stack, this.string, this.x + this.width / 2, this.y + this.height / 2 - 5);
    }

    mouseClicked(mouseX, mouseY, mouseButton) {
        this.callback();
    }

    isMouseOver(mouseX, mouseY) {
        return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height;
    }

}