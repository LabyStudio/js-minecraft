import GuiButton from "../widgets/GuiButton.js";
import GuiScreen from "../GuiScreen.js";
import GuiOptions from "./GuiOptions.js";

export default class GuiIngameMenu extends GuiScreen {

    constructor() {
        super();
    }

    init() {
        super.init();

        let y = this.height / 2 - 30;
        this.buttonList.push(new GuiButton("Back to game", this.width / 2 - 100, y, 200, 20, () => {
            this.minecraft.displayScreen(null);
        }));

        this.buttonList.push(new GuiButton("Options...", this.width / 2 - 100, y + 24, 200, 20, () => {
            this.minecraft.displayScreen(new GuiOptions(this));
        }));

        this.buttonList.push(new GuiButton("Save and Quit to Title", this.width / 2 - 100, y + 70, 200, 20, () => {
            this.minecraft.loadWorld(null);
        }));
    }

    drawScreen(stack, mouseX, mouseY, partialTicks) {
        // Background
        this.drawRect(stack, 0, 0, this.width, this.height, 'black', 0.6);

        // Title
        this.drawCenteredString(stack, "Game menu", this.width / 2, 50);

        super.drawScreen(stack, mouseX, mouseY, partialTicks);
    }

}