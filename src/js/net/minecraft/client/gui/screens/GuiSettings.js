import GuiScreen from "../GuiScreen.js";
import GuiButton from "../widgets/GuiButton.js";
import GuiSwitchButton from "../widgets/GuiSwitchButton.js";
import GuiSliderButton from "../widgets/GuiSliderButton.js";

export default class GuiSettings extends GuiScreen {

    constructor(previousScreen) {
        super();

        this.previousScreen = previousScreen;
    }

    init() {
        super.init();

        let settings = this.minecraft.settings;

        let scope = this;
        this.buttonList.push(new GuiSwitchButton("Ambient Occlusion", settings.ambientOcclusion, this.width / 2 - 100, this.height / 2 - 30, 200, 20, function (value) {
            settings.ambientOcclusion = value;
            scope.minecraft.worldRenderer.rebuildAll();
        }));
        this.buttonList.push(new GuiSwitchButton("View Bobbing", settings.viewBobbing, this.width / 2 - 100, this.height / 2 - 5, 200, 20, function (value) {
            settings.viewBobbing = value;
        }));
        this.buttonList.push(new GuiSliderButton("FOV", settings.fov, 50, 100, this.width / 2 - 100, this.height / 2 + 20, 200, 20, function (value) {
            settings.fov = value;
        }));

        this.buttonList.push(new GuiButton("Done", this.width / 2 - 100, this.height / 2 + 70, 200, 20, function () {
            scope.minecraft.displayScreen(scope.previousScreen);
        }));
    }

    drawScreen(stack, mouseX, mouseY, partialTicks) {
        // Background
        this.drawRect(stack, 0, 0, this.width, this.height, 'black', 0.6);

        // Title
        this.drawCenteredString(stack, "Settings", this.width / 2, 50);

        super.drawScreen(stack, mouseX, mouseY, partialTicks);
    }

    onClose() {
        // Save settings
        this.minecraft.settings.save();
    }

}