import GuiScreen from "../GuiScreen.js";
import GuiKeyButton from "../widgets/GuiKeyButton.js";
import GuiButton from "../widgets/GuiButton.js";
import GuiSliderButton from "../widgets/GuiSliderButton.js";

export default class GuiControls extends GuiScreen {

    constructor(previousScreen) {
        super();

        this.previousScreen = previousScreen;
    }

    init() {
        super.init();

        let settings = this.minecraft.settings;

        let scope = this;
        this.buttonList.push(new GuiSliderButton("Mouse Sensitivity", settings.sensitivity, 50, 150, this.width / 2 - 100, this.height / 2 - 55, 200, 20, function (value) {
            settings.sensitivity = value;
        }).setDisplayNameBuilder(function (name, value) {
            return name + ": " + value + "%";
        }));

        this.buttonList.push(new GuiKeyButton("Crouch", settings.crouching, this.width / 2 - 100, this.height / 2 - 30, 200, 20, function (key) {
            settings.crouching = key;
        }));

        this.buttonList.push(new GuiKeyButton("Sprint", settings.sprinting, this.width / 2 - 100, this.height / 2 - 5, 200, 20, function (key) {
            settings.sprinting = key;
        }));

        this.buttonList.push(new GuiKeyButton("Toggle Perspective", settings.togglePerspective, this.width / 2 - 100, this.height / 2 + 20, 200, 20, function (key) {
            settings.togglePerspective = key;
        }));

        this.buttonList.push(new GuiButton("Done", this.width / 2 - 100, this.height / 2 + 70, 200, 20, function () {
            scope.minecraft.displayScreen(scope.previousScreen);
        }));
    }

    drawScreen(stack, mouseX, mouseY, partialTicks) {
        // Background
        this.drawRect(stack, 0, 0, this.width, this.height, 'black', 0.6);

        // Title
        this.drawCenteredString(stack, "Controls", this.width / 2, 50);

        super.drawScreen(stack, mouseX, mouseY, partialTicks);
    }

    onClose() {
        // Save settings
        this.minecraft.settings.save();
    }

}