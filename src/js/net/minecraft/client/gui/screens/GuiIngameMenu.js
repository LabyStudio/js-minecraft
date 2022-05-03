import GuiButton from "../widgets/GuiButton.js";
import GuiControls from "./GuiControls.js";
import GuiScreen from "../GuiScreen.js";
import GuiSettings from "./GuiSettings.js";

export default class GuiIngameMenu extends GuiScreen {

    constructor() {
        super();
    }

    init() {
        super.init();

        let scope = this;
        this.buttonList.push(new GuiButton("Back to game", this.width / 2 - 100, this.height / 2 - 20, 200, 20, function () {
            scope.minecraft.displayScreen(null);
        }));

        this.buttonList.push(new GuiButton("Settings...", this.width / 2 - 100, this.height / 2 + 20, 98, 20, function () {
            scope.minecraft.displayScreen(new GuiSettings(scope));
        }));

        this.buttonList.push(new GuiButton("Controls...", this.width / 2 + 2, this.height / 2 + 20, 98, 20, function () {
            scope.minecraft.displayScreen(new GuiControls(scope));
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