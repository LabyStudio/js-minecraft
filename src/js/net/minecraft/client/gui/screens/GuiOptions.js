import GuiScreen from "../GuiScreen.js";
import GuiButton from "../widgets/GuiButton.js";
import GuiSwitchButton from "../widgets/GuiSwitchButton.js";
import GuiSliderButton from "../widgets/GuiSliderButton.js";
import GuiControls from "./GuiControls.js";

export default class GuiOptions extends GuiScreen {

    constructor(previousScreen) {
        super();

        this.previousScreen = previousScreen;
    }

    init() {
        super.init();

        let settings = this.minecraft.settings;

        let y = this.height / 2 - 50;
        this.buttonList.push(new GuiSwitchButton("Ambient Occlusion", settings.ambientOcclusion, this.width / 2 - 100, y, 200, 20, value => {
            settings.ambientOcclusion = value;
            this.minecraft.worldRenderer.rebuildAll();
        }));
        this.buttonList.push(new GuiSwitchButton("View Bobbing", settings.viewBobbing, this.width / 2 - 100, y + 24, 200, 20, value => {
            settings.viewBobbing = value;
        }));
        this.buttonList.push(new GuiSliderButton("FOV", settings.fov, 50, 100, this.width / 2 - 100, y + 24 * 2, 200, 20, value => {
            settings.fov = value;
        }));
        this.buttonList.push(new GuiSliderButton("Render Distance", settings.viewDistance, 2, 16, this.width / 2 - 100, y + 24 * 3, 200, 20, value => {
            settings.viewDistance = value;
        }));
        this.buttonList.push(new GuiButton("Controls...", this.width / 2 - 100, y + 24 * 4, 200, 20, () => {
            this.minecraft.displayScreen(new GuiControls(this));
        }));

        this.buttonList.push(new GuiButton("Done", this.width / 2 - 100, y + 130, 200, 20, () => {
            this.minecraft.displayScreen(this.previousScreen);
        }));
    }

    drawScreen(stack, mouseX, mouseY, partialTicks) {
        // Background
        this.drawDefaultBackground(stack);

        // Title
        this.drawCenteredString(stack, "Settings", this.width / 2, 50);

        super.drawScreen(stack, mouseX, mouseY, partialTicks);
    }

    onClose() {
        // Save settings
        this.minecraft.settings.save();
    }

}