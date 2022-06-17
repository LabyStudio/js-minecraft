import GuiScreen from "../GuiScreen.js";
import GuiButton from "../widgets/GuiButton.js";
import GuiTextField from "../widgets/GuiTextField.js";
import GuiConnecting from "./GuiConnecting.js";

export default class GuiDirectConnect extends GuiScreen {

    constructor(previousScreen) {
        super();

        this.previousScreen = previousScreen;
    }

    init() {
        super.init();

        let y = this.height / 2 - 50;

        this.fieldAddress = new GuiTextField(this.width / 2 - 100, y + 30, 200, 20)
        this.fieldAddress.maxLength = 30;
        this.fieldAddress.text = this.minecraft.settings.serverAddress;
        this.buttonList.push(this.fieldAddress);

        this.buttonList.push(new GuiButton("Connect", this.width / 2 - 155, y + 110, 150, 20, () => {
            this.minecraft.displayScreen(new GuiConnecting(this, this.fieldAddress.text));
        }));
        this.buttonList.push(new GuiButton("Cancel", this.width / 2 + 5, y + 110, 150, 20, () => {
            this.minecraft.displayScreen(this.previousScreen);
        }));
    }

    drawScreen(stack, mouseX, mouseY, partialTicks) {
        // Background
        this.drawDefaultBackground(stack);

        // Title
        this.drawCenteredString(stack, "Connect to a server", this.width / 2, 50);

        let y = this.height / 2 - 50;

        // Seed
        this.drawString(stack, "Server Address", this.width / 2 - 100, y + 17, -6250336);

        super.drawScreen(stack, mouseX, mouseY, partialTicks);
    }

    onClose() {
        this.minecraft.settings.serverAddress = this.fieldAddress.text;
        this.minecraft.settings.save();
    }

}