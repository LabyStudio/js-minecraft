window.GuiIngameMenu = class extends GuiScreen {

    constructor() {
        super();
    }

    init() {
        super.init();

        let scope = this;
        this.buttonList.push(new GuiButton("Back to game", this.width / 2 - 100 * 3, this.height / 2 - 50 * 3, 200 * 3, 20 * 3, function () {
            scope.minecraft.displayScreen(null);
        }));
    }

    drawScreen(stack, mouseX, mouseY, partialTicks) {
        // Background
        this.drawRect(stack, 0, 0, this.width, this.height, 'black', 0.6);

        // Title
        this.drawCenteredString(stack, "Game paused", this.width / 2, 100);

        super.drawScreen(stack, mouseX, mouseY, partialTicks);
    }

}