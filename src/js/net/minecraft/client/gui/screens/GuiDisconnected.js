import GuiScreen from "../GuiScreen.js";
import GuiButton from "../widgets/GuiButton.js";
import FontRenderer from "../../render/gui/FontRenderer.js";

export default class GuiDisconnected extends GuiScreen {

    constructor(message) {
        super();

        this.message = message;
    }

    init() {
        super.init();

        this.multilineMessage =this.minecraft.fontRenderer.listFormattedStringToWidth(this.message, this.width - 50);

        let y = this.height / 2 - 50;
        this.buttonList.push(new GuiButton("Done", this.width / 2 - 100, y + 130, 200, 20, () => {
            this.minecraft.displayScreen(null);
        }));
    }

    drawScreen(stack, mouseX, mouseY, partialTicks) {
        // Render dirt background
        this.drawBackground(stack, this.textureBackground, this.width, this.height);

        // Render title
        this.drawCenteredString(stack, "Disconnected from server:", this.width / 2, this.height / 2 - 20, 0x80FFFFFF);

        for(let i = 0; i < this.multilineMessage.length; i++) {
            this.drawCenteredString(stack, this.multilineMessage[i], this.width / 2, this.height / 2 + i * FontRenderer.FONT_HEIGHT);
        }

        super.drawScreen(stack, mouseX, mouseY, partialTicks);
    }

}