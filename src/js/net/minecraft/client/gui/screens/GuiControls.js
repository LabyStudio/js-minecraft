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

        let y = this.height / 2 - 50;
        this.buttonList.push(new GuiSliderButton("Mouse Sensitivity", settings.sensitivity, 50, 150, this.width / 2 - 100, y, 200, 20, value => {
            settings.sensitivity = value;
        }).setDisplayNameBuilder(function (name, value) {
            return name + ": " + value + "%";
        }));

        this.buttonList.push(new GuiKeyButton("Crouch", settings.keyCrouching, this.width / 2 - 100, y + 24, 98, 20, key => {
            settings.keyCrouching = key;
        }));

        this.buttonList.push(new GuiKeyButton("Sprint", settings.keySprinting, this.width / 2 + 2, y + 24, 98, 20, key => {
            settings.keySprinting = key;
        }));

        this.buttonList.push(new GuiKeyButton("Toggle Perspective", settings.keyTogglePerspective, this.width / 2 - 100, y + 24 * 2, 200, 20, key => {
            settings.keyTogglePerspective = key;
        }));

        this.buttonList.push(new GuiKeyButton("Open Chat", settings.keyOpenChat, this.width / 2 - 100, y + 24 * 3, 200, 20, key => {
            settings.keyOpenChat = key;
        }));

        this.buttonList.push(new GuiKeyButton("Open Inventory", settings.keyOpenInventory, this.width / 2 - 100, y + 24 * 4, 200, 20, key => {
            settings.keyOpenInventory = key;
        }));

        this.buttonList.push(new GuiButton("Done", this.width / 2 - 100, y + 130, 200, 20, () => {
            this.minecraft.displayScreen(this.previousScreen);
        }));
    }

    drawScreen(stack, mouseX, mouseY, partialTicks) {
        // Background
        this.drawDefaultBackground(stack);

        // Title
        this.drawCenteredString(stack, "Controls", this.width / 2, 50);

        super.drawScreen(stack, mouseX, mouseY, partialTicks);
    }

    onClose() {
        // Save settings
        this.minecraft.settings.save();
    }

}