import GuiScreen from "../GuiScreen.js";
import GuiButton from "../widgets/GuiButton.js";
import GuiTextField from "../widgets/GuiTextField.js";
import GuiConnecting from "./GuiConnecting.js";
import GameProfile from "../../../util/GameProfile.js";
import UUID from "../../../util/UUID.js";
import Session from "../../../util/Session.js";
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

        this.fieldName = new GuiTextField(this.width / 2 - 100, y + 60, 200, 20)
        this.fieldName.maxLength = 30;
        this.fieldName.text = this.minecraft.settings.name;
        this.buttonList.push(this.fieldName);

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
        this.minecraft.settings.name = this.fieldName.text;
        this.minecraft.settings.save();
        

        // Load session from settings
        if (this.minecraft.settings.session === null) {
            let username = this.minecraft.settings.name;
            let profile = new GameProfile(UUID.randomUUID(), username);
            this.minecraft.setSession(new Session(profile, ""));
        } else {
            this.minecraft.setSession(Session.fromJson(this.minecraft.settings.session));
        }
    }

}